import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { v4 as uuid } from 'uuid';
import { SessionForListingWithNotes } from '../../models/session.viewmodel';
import { Room } from '../../../rooms/models/room.model';
import { Judge } from '../../../judges/models/judge.model';
import { SessionFilters } from '../../models/session-filter.model';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { MatDialog } from '@angular/material';
import { HearingToSessionAssignment } from '../../../hearing-part/models/hearing-to-session-assignment';
import { SessionType } from '../../../core/reference/models/session-type';
import { safe } from '../../../utils/js-extensions';
import { NotesListDialogComponent } from '../../../notes/components/notes-list-dialog/notes-list-dialog.component';
import { getNoteViewModel, NoteViewmodel } from '../../../notes/models/note.viewmodel';
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
import { TableSettings } from '../../../hearing-part/models/table-settings.model';
import { SessionsService } from '../../services/sessions-service';
import { SessionSearchCriteriaService } from '../../services/session-search-criteria.service';
import {
    HearingAmendDialogComponent,
    HearingAmendDialogData
} from '../../../hearing-part/components/hearing-amend-dialog/hearing-amend-dialog.component';
import { Note } from '../../../notes/models/note.model';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { HearingSearchResponseForAmendment } from '../../../hearing-part/models/filtered-hearing-viewmodel';
import { ITransactionDialogData } from '../../../features/transactions/models/transaction-dialog-data.model';
import { CaseType } from '../../../core/reference/models/case-type';
import { setTime } from '../../../utils/moment-utils';

@Component({
    selector: 'app-sessions-listings-search',
    templateUrl: './sessions-listings-search.component.html',
    styleUrls: ['./sessions-listings-search.component.scss']
})
export class SessionsListingsSearchComponent implements OnInit {
    @ViewChild(HearingsTableComponent) hearingsTable;
    @ViewChild(SessionTableComponent) sessionsTable;
    @ViewChild(SessionsFilterComponent) sessionFilter;

    totalSessionsCount: number;
    totalHearingsCount: number;

    selectedSessions: SessionForListingWithNotes[] = [];
    selectedHearing: HearingForListingWithNotes = undefined;

    filterSource$: Observable<SessionFilters>;
    sessionTableSettingsSource$: Observable<TableSettings>;
    hearingTableSettingsSource$: Observable<TableSettings>;
    errorMessage: string;
    numberOfSessions = 1;

    hearingsSource$: BehaviorSubject<HearingForListingWithNotes[]>;
    sessionsSource$: BehaviorSubject<SessionForListingWithNotes[]>;
    hearings$: Observable<HearingForListingWithNotes[]>;
    sessions$: Observable<SessionForListingWithNotes[]>;

    sessionTypes$: Observable<SessionType[]>;
    rooms$: Observable<Room[]>;
    judges$: Observable<Judge[]>;
    caseTypes: CaseType[];
    judges: Judge[];

    savedSessionFilters: SessionFilters;

    constructor(public hearingService: HearingService,
                public notesService: NotesService,
                public sessionsService: SessionsService,
                public sessionSearchCriteriaService: SessionSearchCriteriaService,
                public route: ActivatedRoute,
                public dialog: MatDialog) {
        this.hearingsSource$ = new BehaviorSubject<HearingForListingWithNotes[]>([]);
        this.sessionsSource$ = new BehaviorSubject<SessionForListingWithNotes[]>([]);
        this.hearings$ = this.hearingsSource$.asObservable();
        this.sessions$ = this.sessionsSource$.asObservable();
        this.route.data.subscribe(({judges, sessionTypes, rooms, caseTypes}) => {
            this.judges$ = Observable.of(judges);
            this.judges = judges;
            this.caseTypes = caseTypes;
            this.sessionTypes$ = Observable.of(sessionTypes);
            this.rooms$ = Observable.of(rooms);
        });
    }

    ngOnInit() {
        this.hearingTableSettingsSource$ = this.hearingsTable.tableSettingsSource$.asObservable();
        this.hearingTableSettingsSource$.subscribe(this.fetchHearings);

        this.filterSource$ = this.sessionFilter.filterSource$.asObservable();
        this.sessionTableSettingsSource$ = this.sessionsTable.tableSettingsSource$.asObservable();
        combineLatest(this.sessionTableSettingsSource$, this.filterSource$, this.fetchSessions).subscribe()
    }

    selectHearing(hearing: HearingForListingWithNotes) {
        this.selectedHearing = hearing;
        this.numberOfSessions = this.selectedHearing !== undefined ? this.selectedHearing.numberOfSessions : 0;
    }

    selectSession(sessions: SessionForListingWithNotes[]) {
        this.selectedSessions = sessions;
    }

    assignToSessions(assignHearingData: AssignHearingData) {
        let assignment = {
            hearingId: this.selectedHearing.id,
            hearingVersion: this.selectedHearing.version,
            sessionsData: this.selectedSessions.map(s => {return {sessionId: s.sessionId, sessionVersion: s.sessionVersion}}),
            userTransactionId: uuid(),
            start: this.calculateValidStartDateTime(assignHearingData.startTime)
        } as HearingToSessionAssignment;

        this.hearingService.assignToSession(assignment);

        this.openSummaryDialog().afterClosed().subscribe((accepted) => {
            if (accepted) {
                this.notesService.upsertManyNotes(assignHearingData.notes).subscribe()
            }

            this.fetchHearings(this.hearingsTable.tableSettingsSource$.getValue());
            this.fetchSessions(this.sessionsTable.tableSettingsSource$.getValue(), this.sessionFilter.filterSource$.getValue());

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
            this.errorMessage = 'Please select the required number of sessions';
            return false;
        }
    }

    openAssignDialog() {
        this.dialog.open(AssignHearingDialogComponent, {
            data: {
                hearingId: this.selectedHearing.id,
                startTimeDisplayed: !(this.selectedSessions.length > 1),
                startTime: (this.selectedSessions.length >= 1) ? this.selectedSessions[0].startTime : undefined
            }
        }).afterClosed().subscribe((data: AssignHearingData) => {
            if (data.confirmed) {
                this.assignToSessions(data)
            }
        })
    }

    openNotesDialog(session: SessionForListingWithNotes) {
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
        this.hearingsTable.clearSelection();
    }

    openEditDialog(hearingId: string) {
        this.onHearingsClearSelection();
        this.onSessionsClearSelection();

        let hearingSource$: Observable<HearingSearchResponseForAmendment> = this.hearingService.getForAmendment(hearingId);
        let hearingNotesSource$: Observable<Note[]> = this.notesService.getByEntities([hearingId]);

        forkJoin([hearingSource$, hearingNotesSource$]).pipe(mergeMap(([hearing, hearingNotes]) => {
                return this.openAmendDialog(hearing, hearingNotes).afterClosed();
            }),
            filter(amendedHearing => amendedHearing !== undefined),
            tap(amendedHearing => {
                this.hearingService.updateListing(amendedHearing);
                this.openDialog('Editing listing request', amendedHearing.notes);
            })
        ).subscribe()
    }

    private calculateValidStartDateTime(hearingStartTime: string): Date | null {
        if (this.selectedSessions.length === 1) {
            return setTime(this.selectedSessions[0].startDate, hearingStartTime).toDate();
        }

        return null;
    }

    private openAmendDialog(hearing: HearingSearchResponseForAmendment, notes: Note[]) {
        const hearingAmendDialogData: HearingAmendDialogData = {
            hearingViewModel: { hearing, notes },
            judges: this.judges,
            caseTypes: this.caseTypes
        };
        return this.dialog.open(HearingAmendDialogComponent, {
            data: hearingAmendDialogData
        })
    }

    private openDialog(actionTitle: string, notes: NoteViewmodel[]) {
        this.dialog.open<any, ITransactionDialogData>(TransactionDialogComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: {actionTitle}
        }).afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                if (notes.length > 0) {
                    this.notesService.upsertManyNotes(notes).subscribe(() => {
                        this.fetchHearings(this.hearingsTable.tableSettingsSource$.getValue());
                        this.fetchSessions(this.sessionsTable.tableSettingsSource$.getValue(), this.sessionFilter.filterSource$.getValue());
                        return;
                    });
                }

                this.fetchHearings(this.hearingsTable.tableSettingsSource$.getValue());
                this.fetchSessions(this.sessionsTable.tableSettingsSource$.getValue(), this.sessionFilter.filterSource$.getValue());
            }
        });
    }

    private checkIfOnlyOneJudgeSelected() {
        if (!this.selectedHearing.multiSession) {
            this.errorMessage = '';
            return true;
        } else if (!this.selectedSessions.every((val, i, arr) =>
            safe(() => val.personId) === safe(() => arr[0].personId) && val.personId !== null)) {
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

    private fetchHearings = (tableSettings: TableSettings) => {
        const request = {
            httpParams: {
                size: tableSettings.pageSize,
                page: tableSettings.pageIndex,
                sortByProperty: tableSettings.sortByProperty,
                sortByDirection: tableSettings.sortDirection,
            },
            searchCriteria: []
        };

        this.hearingService.getHearingsForListing(request).subscribe(hearings => {
            this.hearingsSource$.next(hearings.content || []);
            this.totalHearingsCount = hearings.totalElements;
        })
    };

    private fetchSessions = (tableSettings: TableSettings, filters: SessionFilters) => {
        const request = {
            httpParams: {
                size: tableSettings.pageSize,
                page: tableSettings.pageIndex,
                sortByProperty: tableSettings.sortByProperty,
                sortDirection: tableSettings.sortDirection,
            },
            searchCriteria: this.sessionSearchCriteriaService.convertToSearchCriterions(filters)
        };

        this.totalSessionsCount = 0;

        this.sessionsService.getSessionsForListing(request).subscribe(sessions => {
            this.sessionsSource$.next(sessions.content || []);
            this.totalSessionsCount = sessions.totalElements;

            if (JSON.stringify(this.savedSessionFilters) !== JSON.stringify(filters)) {
                this.sessionsTable.goToFirstPage();
            }

            this.savedSessionFilters = JSON.parse(JSON.stringify(filters));
        })
    }
}
