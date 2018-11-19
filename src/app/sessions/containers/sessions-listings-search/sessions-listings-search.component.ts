import { Component, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SearchForDates } from '../../actions/session.action';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as fromHearingParts from '../../../hearing-part/reducers';
import * as fromSessions from '../../reducers';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { SessionViewModel } from '../../models/session.viewmodel';
import * as fromHearingPartsActions from '../../../hearing-part/actions/hearing-part.action';
import { Room } from '../../../rooms/models/room.model';
import { Judge } from '../../../judges/models/judge.model';
import { SessionFilters } from '../../models/session-filter.model';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subject } from 'rxjs/Subject';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { MatDialog } from '@angular/material';
import { HearingToSessionAssignment } from '../../../hearing-part/models/hearing-to-session-assignment';
import { HearingModificationService } from '../../../hearing-part/services/hearing-modification.service';
import { asArray } from '../../../utils/array-utils';
import { SessionType } from '../../../core/reference/models/session-type';
import { SessionsFilterService } from '../../services/sessions-filter-service';
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

@Component({
    selector: 'app-sessions-listings-search',
    templateUrl: './sessions-listings-search.component.html',
    styleUrls: ['./sessions-listings-search.component.scss']
})
export class SessionsListingsSearchComponent implements OnInit {

    @ViewChild(HearingPartsPreviewComponent) hearingPartsTable;
    @ViewChild(SessionTableComponent) sessionsTable;

    startDate: moment.Moment;
    endDate: moment.Moment;
    hearings$: Observable<HearingViewmodel[]>;
    sessions$: Observable<SessionViewModel[]>;
    rooms$: Observable<Room[]>;
    judges$: Observable<Judge[]>;
    selectedSessions: SessionViewModel[] = [];
    selectedHearing: HearingViewmodel = undefined;
    filters$ = new Subject<SessionFilters>();
    sessionTypes$: Observable<SessionType[]>;
    filteredSessions: SessionViewModel[];
    errorMessage: string;
    numberOfSessions = 1;
    multiSession = false;

    constructor(private readonly store: Store<fromHearingParts.State>,
                private readonly sessionsFilterService: SessionsFilterService,
                private route: ActivatedRoute,
                public hearingModificationService: HearingModificationService,
                public dialog: MatDialog) {
        this.hearings$ = this.store.pipe(
          select(fromHearingParts.getFullUnlistedHearings),
            map(asArray),
          ) as Observable<HearingViewmodel[]>;

        this.route.data.subscribe(({judges, sessionTypes, rooms}) => {
            this.judges$ = Observable.of(judges);
            this.sessionTypes$ = Observable.of(sessionTypes);
            this.rooms$ = Observable.of(rooms);
        });

        this.sessions$ = this.store.pipe(select(fromSessions.getFullSessions));
        this.startDate = moment();
        this.endDate = moment().add(3, 'months');

        combineLatest(this.sessions$, this.filters$, this.filterSessions).subscribe((data) => { this.filteredSessions = data});
    }

    ngOnInit() {
        this.store.dispatch(new SearchForDates({startDate: this.startDate, endDate: this.endDate}));
        this.store.dispatch(new fromHearingPartsActions.Search({ isListed: false }));
    }

    filterSessions = (sessions: SessionViewModel[], filters: SessionFilters): SessionViewModel[] => {
        if (!filters) {
            return sessions;
        }
        if (filters.startDate !== this.startDate) {
            this.store.dispatch(new SearchForDates({startDate: filters.startDate, endDate: filters.endDate}));
            this.startDate = filters.startDate;
            this.endDate = filters.endDate;
        }

        return sessions.filter(s => this.sessionsFilterService.filterByProperty(s.person, filters.judges))
            .filter(s => this.sessionsFilterService.filterByProperty(s.room, filters.rooms))
            .filter(s => this.sessionsFilterService.filterBySessionType(s, filters))
            .filter(s => this.sessionsFilterService.filterByUtilization(s, filters.utilization));
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
}
