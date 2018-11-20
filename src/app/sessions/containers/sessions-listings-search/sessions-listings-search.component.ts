import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as fromHearingParts from '../../../hearing-part/reducers';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { SessionViewModel } from '../../models/session.viewmodel';
import * as fromHearingPartsActions from '../../../hearing-part/actions/hearing-part.action';
import { Room } from '../../../rooms/models/room.model';
import { Judge } from '../../../judges/models/judge.model';
import { SessionFilters } from '../../models/session-filter.model';
import { Subject } from 'rxjs/Subject';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { MatDialog, PageEvent } from '@angular/material';
import { HearingToSessionAssignment } from '../../../hearing-part/models/hearing-to-session-assignment';
import { HearingModificationService } from '../../../hearing-part/services/hearing-modification.service';
import { SessionType } from '../../../core/reference/models/session-type';
import { safe } from '../../../utils/js-extensions';
import { NotesListDialogComponent } from '../../../notes/components/notes-list-dialog/notes-list-dialog.component';
import { getNoteViewModel } from '../../../notes/models/note.viewmodel';
import { HearingViewmodel } from '../../../hearing-part/models/hearing.viewmodel';
import {
    AssignHearingData,
    AssignHearingDialogComponent
} from '../../../hearing-part/components/assign-hearing-dialog/assign-hearing-dialog.component';
import * as fromNotes from '../../../notes/actions/notes.action';
import { DEFAULT_DIALOG_CONFIG } from '../../../features/transactions/models/default-dialog-confg';
import { HearingPartsPreviewComponent } from '../../../hearing-part/components/hearing-parts-preview/hearing-parts-preview.component';
import { SessionTableComponent } from '../../components/session-table/session-table.component';
import { ActivatedRoute } from '@angular/router';
import { Status } from '../../../core/reference/models/status.model';
import { HearingService } from '../../../hearing/services/hearing.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SessionsFilterComponent } from '../../components/sessions-filter/sessions-filter.component';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
    selector: 'app-sessions-listings-search',
    templateUrl: './sessions-listings-search.component.html',
    styleUrls: ['./sessions-listings-search.component.scss']
})
export class SessionsListingsSearchComponent implements OnInit {

    public static DEFAULT_PAGING: PageEvent = {
        pageSize: 10,
        pageIndex: 0,
        length: undefined
    };

    @ViewChild(HearingPartsPreviewComponent) hearingPartsTable;
    @ViewChild(SessionTableComponent) sessionsTable;
    @ViewChild(SessionsFilterComponent) sessionFilter;

    latestSessionsPaging = SessionsListingsSearchComponent.DEFAULT_PAGING;
    latestHearingsPaging = SessionsListingsSearchComponent.DEFAULT_PAGING;
    totalSessionsCount: number;
    totalHearingsCount: number;
    latestFilters: SessionFilters;

    selectedSessions: SessionViewModel[] = [];
    selectedHearing: HearingViewmodel = undefined;
    filters$ = new Subject<SessionFilters>();
    filterSource$: Observable<SessionFilters>;
    sessionPaginationSource$: Observable<any>;
    errorMessage: string;
    numberOfSessions = 1;
    multiSession = false;

    hearingsSource$: BehaviorSubject<HearingViewmodel[]>;
    sessionsSource$: BehaviorSubject<SessionViewModel[]>;
    hearings$: Observable<HearingViewmodel[]>;
    sessions$: Observable<SessionViewModel[]>;

    sessionTypes$: Observable<SessionType[]>;
    rooms$: Observable<Room[]>;
    judges$: Observable<Judge[]>;

    constructor(private readonly store: Store<fromHearingParts.State>,
                private readonly hearingService: HearingService,
                private route: ActivatedRoute,
                public hearingModificationService: HearingModificationService,
                public dialog: MatDialog) {
        this.hearingsSource$ = new BehaviorSubject<HearingViewmodel[]>([]);
        this.sessionsSource$ = new BehaviorSubject<SessionViewModel[]>([]);
        this.hearings$ = this.hearingsSource$.asObservable();
        this.sessions$ = this.sessionsSource$.asObservable();
        this.route.data.subscribe(({judges, sessionTypes, rooms}) => {
            this.judges$ = Observable.of(judges);
            this.sessionTypes$ = Observable.of(sessionTypes);
            this.rooms$ = Observable.of(rooms);
        });

        this.fetchHearings(this.latestHearingsPaging);
    }

    ngOnInit() {
        this.filterSource$ = this.sessionFilter.getFilterSource().asObservable();
        this.sessionPaginationSource$ = this.sessionsTable.getPaginationSource().asObservable();

        combineLatest(this.sessionPaginationSource$, this.filterSource$, this.fetchSessions).subscribe()
    }

    selectHearing(hearing: HearingViewmodel) {
        this.selectedHearing = hearing;
        this.numberOfSessions = this.selectedHearing !== undefined ? this.selectedHearing.numberOfSessions : 0;
        this.multiSession = this.selectedHearing !== undefined ? this.selectedHearing.multiSession : false;
    }

    selectSession(sessions: SessionViewModel[]) {
        this.selectedSessions = sessions;
    }

    assignToSessions(assignHearingData: AssignHearingData) {
        let assignment = {
            hearingId: this.selectedHearing.id,
            hearingVersion: this.selectedHearing.version,
            sessionsData: this.selectedSessions.map(session => {return {sessionId: session.id, sessionVersion: session.version}}),
            userTransactionId: uuid(),
            start: this.selectedSessions.length > 1 ? null : moment(assignHearingData.startTime, 'HH:mm').toDate()
        } as HearingToSessionAssignment;

        this.hearingModificationService.assignWithSession(assignment);

        this.openSummaryDialog().afterClosed().subscribe((accepted) => {
            this.store.dispatch(new fromHearingPartsActions.Search());
            if (accepted) {
                this.store.dispatch(new fromNotes.CreateMany(assignHearingData.notes));
            }

            this.onHearingsClearSelection();
            this.onSessionsClearSelection();
        });
    }

    assignButtonEnabled() {
        if (this.selectedHearing === undefined) {
            this.errorMessage = '';
            return false;
        } else if (this.numberOfSessions === this.selectedSessions.length) {
            this.errorMessage = '';
            return this.checkIfOnlyOneJudgeSelected();
        } else {
            this.errorMessage = 'Incorrect number of sessions selected';
            return false;
        }
    }

    openAssignDialog() {
        this.dialog.open(AssignHearingDialogComponent, {
            data: {hearingId: this.selectedHearing.id, startTimeDisplayed: !(this.selectedSessions.length > 1)}
        }).afterClosed().subscribe((data: AssignHearingData) => {
            if (data.confirmed) {
                this.assignToSessions(data)
            }
        })
    }

    openNotesDialog(session: SessionViewModel) {
        this.dialog.open(NotesListDialogComponent, {
            data: session.notes.map(getNoteViewModel),
            hasBackdrop: false,
            width: '30%'
        })
    }

    onHearingsClearSelection() {
        this.resetSelections();
        this.sessionsTable.clearSelection();
    }

    onSessionsClearSelection() {
        this.resetSelections();
        this.hearingPartsTable.clearSelection();
    }

    onNextHearingsPage(pageEvent: PageEvent) {
        this.latestHearingsPaging = pageEvent;
        this.fetchHearings(pageEvent);
    }

    onNextSessionsPage(pageEvent: PageEvent) {
        this.latestSessionsPaging = pageEvent;
        this.fetchSessions(pageEvent, this.latestFilters);
    }

    private checkIfOnlyOneJudgeSelected() {
        if (!this.selectedHearing.multiSession) {
            this.errorMessage = '';
            return true;
        } else if (!this.selectedSessions.every((val, i, arr) =>
            safe(() => val.person.id) === safe(() => arr[0].person.id) && val.person !== undefined)) {
            this.errorMessage = 'All selected sessions should have the same judge assigned';
            return false;
        } else {
            return true;
        }
    }

    private openSummaryDialog() {
        return this.dialog.open(TransactionDialogComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: 'Assigning hearing part to session'
        });
    }

    private resetSelections() {
        this.selectedSessions = [];
        this.selectedHearing = undefined;
    }

    private fetchHearings(pageEvent: PageEvent) {
        const request = {
            httpParams: {
                size: pageEvent.pageSize,
                page: pageEvent.pageIndex,
            },
            searchCriteria: [{key: 'status.status', operation: 'equals', value: Status.Unlisted}]
        };

        this.hearingService.getHearingsForListing(request).subscribe(hearings => {
            this.hearingsSource$.next(hearings.content || []);
            this.totalHearingsCount = hearings.totalElements;
        })
    }

    private fetchSessions(pageEvent: PageEvent, filters: SessionFilters) {
        // const request = {
        //     httpParams: {
        //         size: pageEvent.pageSize,
        //         page: pageEvent.pageIndex,
        //     },
        //     searchCriteria: []
        // };

        console.log(pageEvent)
        console.log(filters)
        this.totalSessionsCount = 0;

        // this.sessionsService.getSessionsForListing(request).subscribe(sessions => {
        //     this.sessionsSource$.next(sessions.content || []);
        //     this.totalSessionsCount = sessions.totalElements;
        // })
    }
}
