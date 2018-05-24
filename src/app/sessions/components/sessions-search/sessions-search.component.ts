import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SearchForDates } from '../../actions/session.action';
import { HearingPart } from '../../../hearing-part/models/hearing-part';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as fromHearingParts from '../../../hearing-part/reducers/index';
import * as fromSessions from '../../reducers';
import * as fromHearingPartsActions from '../../../hearing-part/actions/hearing-part.action';

import { AssignToSession } from '../../../hearing-part/actions/hearing-part.action';
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

@Component({
  selector: 'app-sessions-search',
  templateUrl: './sessions-search.component.html',
  styleUrls: ['./sessions-search.component.scss']
})
export class SessionsSearchComponent implements OnInit {

    startDate: Date;
    endDate: Date;
    hearingParts$: Observable<HearingPart[]>;
    sessions$: Observable<SessionViewModel[]>;
    rooms$: Observable<Room[]>;
    judges$: Observable<Judge[]>;
    selectedSession: any;
    selectedHearingPartId;
    filteredSessions$: Observable<SessionViewModel[]>;
    sessionsStatsService: SessionsStatisticsService;

    constructor(private store: Store<fromHearingParts.State>, sessionsStatisticsService: SessionsStatisticsService) {
        this.hearingParts$ = this.store.pipe(select(fromHearingParts.getHearingPartsEntities),
            map(this.asArray)) as Observable<HearingPart[]>;
        this.rooms$ = this.store.pipe(select(fromSessions.getRooms), map(this.asArray)) as Observable<Room[]>;
        this.judges$ = this.store.pipe(select(fromJudges.getJudges), map(this.asArray)) as Observable<Judge[]>;

        this.sessions$ = this.store.pipe(select(fromSessions.getFullSessions));
        this.startDate = moment().toDate();
        this.endDate = moment().add(5, 'years').toDate();
        this.selectedHearingPartId = '';
        this.selectedSession = {} ;
        this.filteredSessions$ = this.sessions$;
        this.sessionsStatsService = sessionsStatisticsService;
    }

    ngOnInit() {
        this.store.dispatch(new SearchForDates({startDate: this.startDate, endDate: this.endDate}));
        this.store.dispatch(new fromHearingPartsActions.Search());
        this.store.dispatch(new RoomActions.Get());
        this.store.dispatch(new JudgeActions.Get());
    }

    selectHearingPart(id: string) {
        this.selectedHearingPartId = id;
    }

    filter(filters: SessionFilters) {
        if (filters.startDate !== this.startDate) {
            this.store.dispatch(new SearchForDates({startDate: filters.startDate, endDate: filters.endDate}));
            this.startDate = filters.startDate;
            this.endDate = filters.endDate;
        }

        this.sessions$.subscribe(data => {
            this.filteredSessions$ = Observable.of(
                data.filter(s => this.filterByProperty(s.person, filters.judges))
                .filter(s => this.filterByProperty(s.room, filters.rooms))
                .filter(s => this.filterByCaseType(s, filters))
                .filter(s => this.filterByUtilization(s, filters.utilization))
            )
        })
    }

    private filterByCaseType(s: SessionViewModel, filters: SessionFilters) {
        return filters.caseTypes.length === 0 ? true : filters.caseTypes.includes(s.caseType);
    }

    filterByUtilization(session: SessionViewModel, filters) {
        let matches = false;
        let anyFilterActive = false;
        Object.values(filters).forEach((filter: UtilizationFilter) => {
            if (filter.active) {
                anyFilterActive = true;
                let allocated = this.sessionsStatsService.calculateAllocatedHearingsDuration(session);
                let sessionUtilization = this.sessionsStatsService
                    .calculateUtilizedDuration(moment.duration(session.duration), allocated);
                if (sessionUtilization >= filter.from && sessionUtilization <= filter.to) {
                    matches = true;
                }
            }
        });

        return !anyFilterActive ? true : matches;
    }

    filterByProperty(property, filters) {
        if (filters.length === 0) {
            return true;
        }

        if (property) {
           return filters.includes(property.id)
        }

        return filters.includes('');
    }

    assignToSession() {
        this.store.dispatch(new AssignToSession({
            hearingPartId: this.selectedHearingPartId,
            sessionId: this.selectedSession.id,
            start: null // this.calculateStartOfHearing(this.selectedSession)
        }));
    }

    selectSession(session: SessionViewModel) {
        this.selectedSession = session;
    }

    assignButtonEnabled() {
        return (this.selectedHearingPartId !== '') && (this.selectedSession.id);
    }

    asArray(data) {
        return data ? Object.values(data) : [];
    }
}
