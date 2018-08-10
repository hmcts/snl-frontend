import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SearchForDates } from '../../actions/session.action';
import { HearingPart } from '../../../hearing-part/models/hearing-part';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as fromHearingParts from '../../../hearing-part/reducers';
import * as fromSessions from '../../reducers';
import * as fromHearingPartsActions from '../../../hearing-part/actions/hearing-part.action';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { SessionViewModel } from '../../models/session.viewmodel';
import * as RoomActions from '../../../rooms/actions/room.action';
import * as JudgeActions from '../../../judges/actions/judge.action';
import { Room } from '../../../rooms/models/room.model';
import { Judge } from '../../../judges/models/judge.model';
import * as fromJudges from '../../../judges/reducers';
import { SessionFilters, UtilizationFilter } from '../../models/session-filter.model';
import { map } from 'rxjs/operators';
import { SessionsStatisticsService } from '../../services/sessions-statistics-service';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subject } from 'rxjs/Subject';
import { TransactionDialogComponent } from '../../components/transaction-dialog/transaction-dialog.component';
import { MatDialog } from '@angular/material';
import { SessionAssignment } from '../../../hearing-part/models/session-assignment';
import { HearingPartModificationService } from '../../../hearing-part/services/hearing-part-modification-service';
import { asArray } from '../../../utils/array-utils';

@Component({
    selector: 'app-sessions-search',
    templateUrl: './sessions-search.component.html',
    styleUrls: ['./sessions-search.component.scss']
})
export class SessionsSearchComponent implements OnInit {

    startDate: moment.Moment;
    endDate: moment.Moment;
    hearingParts$: Observable<HearingPart[]>;
    sessions$: Observable<SessionViewModel[]>;
    rooms$: Observable<Room[]>;
    judges$: Observable<Judge[]>;
    selectedSession: any;
    selectedHearingPart;
    filteredSessions$: Observable<SessionViewModel[]>;
    filters$ = new Subject<SessionFilters>();

    constructor(private readonly store: Store<fromHearingParts.State>,
                private readonly sessionsStatsService: SessionsStatisticsService,
                public hearingModificationService: HearingPartModificationService,
                public dialog: MatDialog) {
        this.hearingParts$ = this.store.pipe(
            select(fromHearingParts.getHearingPartsEntities),
            map(asArray),
            map(this.filterUnlistedHearingParts)
        ) as Observable<HearingPart[]>;

        this.rooms$ = this.store.pipe(select(fromSessions.getRooms), map(asArray)) as Observable<Room[]>;
        this.judges$ = this.store.pipe(select(fromJudges.getJudges), map(asArray)) as Observable<Judge[]>;

        this.sessions$ = this.store.pipe(select(fromSessions.getFullSessions));
        this.startDate = moment();
        this.endDate = moment().add(5, 'years');
        this.selectedHearingPart = {};
        this.selectedSession = {};
        this.filteredSessions$ = this.sessions$;
    }

    ngOnInit() {
        this.store.dispatch(new SearchForDates({startDate: this.startDate, endDate: this.endDate}));
        this.store.dispatch(new fromHearingPartsActions.Search({ isListed: false }));
        this.store.dispatch(new RoomActions.Get());
        this.store.dispatch(new JudgeActions.Get());

        this.filteredSessions$ = combineLatest(this.sessions$, this.filters$, this.filterSessions);
    }

    filterSessions = (sessions: SessionViewModel[], filters: SessionFilters): SessionViewModel[] => {
        if (filters.startDate !== this.startDate) {
            this.store.dispatch(new SearchForDates({startDate: filters.startDate, endDate: filters.endDate}));
            this.startDate = filters.startDate;
            this.endDate = filters.endDate;
        }

        return sessions.filter(s => this.filterByProperty(s.person, filters.judges))
            .filter(s => this.filterByProperty(s.room, filters.rooms))
            .filter(s => this.filterByCaseType(s, filters))
            .filter(s => this.filterByUtilization(s, filters.utilization));
    }

    selectHearingPart(hearingPart: HearingPart) {
        this.selectedHearingPart = hearingPart;
    }

    assignToSession() {
        this.hearingModificationService.assignHearingPartWithSession({
            hearingPartId: this.selectedHearingPart.id,
            hearingPartVersion: this.selectedHearingPart.version,
            sessionId: this.selectedSession.id,
            sessionVersion: this.selectedSession.version,
            userTransactionId: uuid(),
            start: null // this.calculateStartOfHearing(this.selectedSession)
        } as SessionAssignment);

        this.openSummaryDialog();
    }

    selectSession(session: SessionViewModel) {
        this.selectedSession = session;
    }

    assignButtonEnabled() {
        return !!((this.selectedHearingPart.id) && (this.selectedSession.id));
    }

    private filterByCaseType(s: SessionViewModel, filters: SessionFilters) {
        return filters.caseTypes.length === 0 ? true : filters.caseTypes.includes(s.caseType);
    }

    private filterByUtilization(session: SessionViewModel, filters) {
        let matches = false;
        let anyFilterActive = false;
        Object.values(filters).forEach((filter: UtilizationFilter) => {
            if (filter.active) {
                anyFilterActive = true;
                const allocated = this.sessionsStatsService.calculateAllocatedHearingsDuration(session);
                const sessionUtilization = this.sessionsStatsService
                    .calculateUtilizedDuration(moment.duration(session.duration), allocated);
                if (sessionUtilization >= filter.from && sessionUtilization <= filter.to) {
                    matches = true;
                }
            }
        });

        return !anyFilterActive ? true : matches;
    }

    private filterByProperty(property, filters) {
        if (filters.length === 0) {
            return true;
        }

        if (property) {
            return filters.includes(property.id);
        }

        return filters.includes('');
    }

    private openSummaryDialog() {
        this.dialog.open(TransactionDialogComponent, {
            width: 'auto',
            minWidth: 350,
            hasBackdrop: true
        });
    }

    private filterUnlistedHearingParts(data: HearingPart[]): HearingPart[] {
        return data.filter(h => {
            return h.session === undefined || h.session === '' || h.session === null
        });
    }
}
