import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SearchForDates } from '../../actions/session.action';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as fromHearingParts from '../../../hearing-part/reducers';
import * as fromSessions from '../../reducers';
import * as fromJudges from '../../../judges/reducers';
import * as fromReferenceData from '../../../core/reference/reducers';
import * as moment from 'moment';
import { SessionViewModel } from '../../models/session.viewmodel';
import * as RoomActions from '../../../rooms/actions/room.action';
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as fromHearingPartsActions from '../../../hearing-part/actions/hearing-part.action';
import { Room } from '../../../rooms/models/room.model';
import { Judge } from '../../../judges/models/judge.model';
import { SessionFilters, UtilizationFilter } from '../../models/session-filter.model';
import { map } from 'rxjs/operators';
import { SessionsStatisticsService } from '../../services/sessions-statistics-service';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { asArray } from '../../../utils/array-utils';
import { HearingPartViewModel } from '../../../hearing-part/models/hearing-part.viewmodel';
import { SessionType } from '../../../core/reference/models/session-type';

@Component({
    selector: 'app-sessions-search',
    templateUrl: './sessions-search.component.html',
    styleUrls: ['./sessions-search.component.scss']
})
export class SessionsSearchComponent implements OnInit {

    startDate: moment.Moment;
    endDate: moment.Moment;
    hearingParts$: Observable<HearingPartViewModel[]>;
    sessions$: Observable<SessionViewModel[]>;
    rooms$: Observable<Room[]>;
    judges$: Observable<Judge[]>;
    filteredSessions$: Observable<SessionViewModel[]>;
    filters$ = new Subject<SessionFilters>();
    sessionTypes$: Observable<SessionType[]>;

    constructor(private readonly store: Store<fromHearingParts.State>,
                private readonly sessionsStatsService: SessionsStatisticsService,
                public dialog: MatDialog) {
        this.hearingParts$ = this.store.pipe(
            select(fromHearingParts.getFullHearingParts),
            map(asArray),
            map(this.filterUnlistedHearingParts)
        ) as Observable<HearingPartViewModel[]>;

        this.rooms$ = this.store.pipe(select(fromSessions.getRooms), map(asArray)) as Observable<Room[]>;
        this.judges$ = this.store.pipe(select(fromJudges.getJudges), map(asArray)) as Observable<Judge[]>;
        this.sessionTypes$ = this.store.pipe(select(fromReferenceData.selectSessionTypes));

        this.sessions$ = this.store.pipe(select(fromSessions.getFullSessions));
        this.startDate = moment();
        this.endDate = moment().add(5, 'years');
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
            .filter(s => this.filterBySessionType(s, filters))
            .filter(s => this.filterByUtilization(s, filters.utilization));
    }

    private filterBySessionType(s: SessionViewModel, filters: SessionFilters) {
        return filters.sessionTypes.length === 0 ? true : filters.sessionTypes.includes(s.sessionType.code);
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

    private filterUnlistedHearingParts(data: HearingPartViewModel[]): HearingPartViewModel[] {
        return data.filter(h => {
            return h.session === undefined || h.session === '' || h.session === null
        });
    }
}
