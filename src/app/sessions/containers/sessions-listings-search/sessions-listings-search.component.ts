import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SearchForDates } from '../../actions/session.action';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as fromHearingParts from '../../../hearing-part/reducers';
import * as fromSessions from '../../reducers';
import * as fromJudges from '../../../judges/reducers';
import * as fromReferenceData from '../../../core/reference/reducers';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { SessionViewModel } from '../../models/session.viewmodel';
import * as RoomActions from '../../../rooms/actions/room.action';
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as fromHearingPartsActions from '../../../hearing-part/actions/hearing-part.action';
import { Room } from '../../../rooms/models/room.model';
import { Judge } from '../../../judges/models/judge.model';
import { SessionFilters } from '../../models/session-filter.model';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subject } from 'rxjs/Subject';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { MatDialog } from '@angular/material';
import { SessionAssignment } from '../../../hearing-part/models/session-assignment';
import { HearingPartModificationService } from '../../../hearing-part/services/hearing-part-modification-service';
import { asArray } from '../../../utils/array-utils';
import { HearingPartViewModel } from '../../../hearing-part/models/hearing-part.viewmodel';
import { SessionType } from '../../../core/reference/models/session-type';
import { SessionsFilterService } from '../../services/sessions-filter-service';

@Component({
    selector: 'app-sessions-listings-search',
    templateUrl: './sessions-listings-search.component.html',
    styleUrls: ['./sessions-listings-search.component.scss']
})
export class SessionsListingsSearchComponent implements OnInit {

    startDate: moment.Moment;
    endDate: moment.Moment;
    hearingParts$: Observable<HearingPartViewModel[]>;
    sessions$: Observable<SessionViewModel[]>;
    rooms$: Observable<Room[]>;
    judges$: Observable<Judge[]>;
    selectedSession: any;
    selectedHearingPart;
    filters$ = new Subject<SessionFilters>();
    sessionTypes$: Observable<SessionType[]>;
    filteredSessions: SessionViewModel[];

    constructor(private readonly store: Store<fromHearingParts.State>,
                private readonly sessionsFilterService: SessionsFilterService,
                public hearingModificationService: HearingPartModificationService,
                public dialog: MatDialog) {
        this.hearingParts$ = this.store.pipe(
          select(fromHearingParts.getFullHearingParts),
            map(asArray),
            map(this.sessionsFilterService.filterUnlistedHearingParts)
          ) as Observable<HearingPartViewModel[]>;

        this.rooms$ = this.store.pipe(select(fromSessions.getRooms), map(asArray)) as Observable<Room[]>;
        this.judges$ = this.store.pipe(select(fromJudges.getJudges), map(asArray)) as Observable<Judge[]>;
        this.sessionTypes$ = this.store.pipe(select(fromReferenceData.selectSessionTypes));

        this.sessions$ = this.store.pipe(select(fromSessions.getFullSessions));
        this.startDate = moment();
        this.endDate = moment().add(5, 'years');
        this.selectedHearingPart = {};
        this.selectedSession = {};

        combineLatest(this.sessions$, this.filters$, this.filterSessions).subscribe((data) => { this.filteredSessions = data});
    }

    ngOnInit() {
        this.store.dispatch(new SearchForDates({startDate: this.startDate, endDate: this.endDate}));
        this.store.dispatch(new fromHearingPartsActions.Search({ isListed: false }));
        this.store.dispatch(new RoomActions.Get());
        this.store.dispatch(new JudgeActions.Get());
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

    selectHearingPart(hearingPart: HearingPartViewModel) {
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

        this.openSummaryDialog().afterClosed().subscribe(() => {
            this.store.dispatch(new fromHearingPartsActions.Search());
        });
    }

    selectSession(session: SessionViewModel) {
        this.selectedSession = session;
    }

    assignButtonEnabled() {
        return !!((this.selectedHearingPart.id) && (this.selectedSession.id));
    }

    private openSummaryDialog() {
        return this.dialog.open(TransactionDialogComponent, {
            data: 'Assigning hearing part to session',
            width: 'auto',
            minWidth: 350,
            hasBackdrop: true
        });
    }
}