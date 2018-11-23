import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { SessionViewModel } from '../../models/session.viewmodel';
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
import { AssignHearingData, AssignHearingDialogComponent }
    from '../../../hearing-part/components/assign-hearing-dialog/assign-hearing-dialog.component';
import { DEFAULT_DIALOG_CONFIG } from '../../../features/transactions/models/default-dialog-confg';
import { SessionTableComponent } from '../../components/session-table/session-table.component';
import { ActivatedRoute } from '@angular/router';
import { HearingService } from '../../../hearing/services/hearing.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SessionsFilterComponent } from '../../components/sessions-filter/sessions-filter.component';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { NotesService } from '../../../notes/services/notes.service';
import { HearingsTableComponent } from '../../../hearing-part/components/hearings-table/hearings-table.component';
import { HearingForListingWithNotes } from '../../../hearing-part/models/hearing-for-listing-with-notes.model';

@Component({
    selector: 'app-sessions-listings-search',
    templateUrl: './sessions-listings-search.component.html',
    styleUrls: ['./sessions-listings-search.component.scss']
})
export class SessionsListingsSearchComponent implements OnInit {
    @ViewChild(HearingsTableComponent) hearingPartsTable;
    @ViewChild(SessionTableComponent) sessionsTable;
    @ViewChild(SessionsFilterComponent) sessionFilter;

    totalSessionsCount: number;
    totalHearingsCount: number;

    selectedSessions: SessionViewModel[] = [];
    selectedHearing: HearingForListingWithNotes = undefined;

    filters$ = new Subject<SessionFilters>();
    filterSource$: Observable<SessionFilters>;
    sessionPaginationSource$: Observable<PageEvent>;
    hearingPaginationSource$: Observable<PageEvent>;
    errorMessage: string;
    numberOfSessions = 1;

    hearingsSource$: BehaviorSubject<HearingForListingWithNotes[]>;
    sessionsSource$: BehaviorSubject<SessionViewModel[]>;
    hearings$: Observable<HearingForListingWithNotes[]>;
    sessions$: Observable<SessionViewModel[]>;

    sessionTypes$: Observable<SessionType[]>;
    rooms$: Observable<Room[]>;
    judges$: Observable<Judge[]>;

    constructor(public hearingService: HearingService,
                public notesService: NotesService,
                public route: ActivatedRoute,
                public hearingModificationService: HearingModificationService,
                public dialog: MatDialog) {
        this.hearingsSource$ = new BehaviorSubject<HearingForListingWithNotes[]>([]);
        this.sessionsSource$ = new BehaviorSubject<SessionViewModel[]>([]);
        this.hearings$ = this.hearingsSource$.asObservable();
        this.sessions$ = this.sessionsSource$.asObservable();
        this.route.data.subscribe(({judges, sessionTypes, rooms}) => {
            this.judges$ = Observable.of(judges);
            this.sessionTypes$ = Observable.of(sessionTypes);
            this.rooms$ = Observable.of(rooms);
        });
    }

    ngOnInit() {
        this.filterSource$ = this.sessionFilter.filterSource$.asObservable();
        this.sessionPaginationSource$ = this.sessionsTable.paginationSource$.asObservable();
        this.hearingPaginationSource$ = this.hearingPartsTable.paginationSource$.asObservable();

        this.hearingPaginationSource$.subscribe((pageEvent: PageEvent) => {
            this.fetchHearings(pageEvent);
        });

        combineLatest(this.sessionPaginationSource$, this.filterSource$, this.fetchSessions).subscribe()

        this.fetchHearings(HearingsTableComponent.DEFAULT_PAGING);
    }

    selectHearing(hearing: HearingForListingWithNotes) {
        this.selectedHearing = hearing;
        this.numberOfSessions = this.selectedHearing !== undefined ? this.selectedHearing.numberOfSessions : 0;
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
            if (accepted) {
                this.notesService.upsertManyNotes(assignHearingData.notes).subscribe()
            }

            this.fetchHearings(this.hearingPartsTable.paginationSource$.getValue());
            this.fetchSessions(this.sessionsTable.paginationSource$.getValue(), this.sessionFilter.filterSource$.getValue());

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
            searchCriteria: []
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

        this.totalSessionsCount = 0;

        // this.sessionsService.getSessionsForListing(request).subscribe(sessions => {
        //     this.sessionsSource$.next(sessions.content || []);
        //     this.totalSessionsCount = sessions.totalElements;
        // })
    }
}
