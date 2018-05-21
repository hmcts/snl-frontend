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
import { SessionFilter } from '../../models/session-filter.model';

@Component({
  selector: 'app-sessions-search',
  templateUrl: './sessions-search.component.html',
  styleUrls: ['./sessions-search.component.scss']
})
export class SessionsSearchComponent implements OnInit {

    startDate;
    endDate;
    hearingParts$: Observable<HearingPart[]>;
    sessions$: Observable<SessionViewModel[]>;
    rooms$: Observable<Room[]>;
    judges$: Observable<Judge[]>;
    selectedSession: any;
    selectedHearingPartId;
    filteredSessions;

    constructor(private store: Store<fromHearingParts.State>) {
        this.store.pipe(select(fromHearingParts.getHearingPartsEntities)).subscribe(data => {
            this.hearingParts$ = Observable.of(data ? Object.values(data) : []);
        });
        this.store.pipe(select(fromSessions.getRooms)).subscribe(data => {
            this.rooms$ = Observable.of(data ? Object.values(data) : []);
        });
        this.store.pipe(select(fromJudges.getJudges)).subscribe(data => {
            this.judges$ = Observable.of(data ? Object.values(data) : []);
        });

        this.sessions$ = this.store.pipe(select(fromSessions.getFullSessions));
        this.startDate = moment().toDate();
        this.endDate = moment().add(5, 'years').toDate();
        this.selectedHearingPartId = '';
        this.selectedSession = {} ;
        this.filteredSessions = this.sessions$;
    }

    ngOnInit() {
        this.store.dispatch(new SearchForDates({startDate: this.startDate, endDate: this.endDate}));
        this.store.dispatch(new fromHearingPartsActions.Search());
        this.store.dispatch(new RoomActions.Get());
        this.store.dispatch(new JudgeActions.Get());
    }

    getSessions(startDate, endDate) {
        this.store.dispatch(new SearchForDates({startDate: startDate, endDate: endDate}));
    }

    deassign() {
        this.store.dispatch(new AssignToSession({
            hearingPartId: this.selectedHearingPartId,
            sessionId: null,
            start: null
        }));
    }

    selectHearingPart(id: string) {
        this.selectedHearingPartId = id;
    }

    filter(filters: SessionFilter) {
        this.sessions$.subscribe(data => {
            this.filteredSessions = Observable.of(
                data.filter(s => this.filterByProperty(s.person, filters.judges))
                .filter(s => this.filterByProperty(s.room, filters.rooms))
                .filter(s => filters.caseTypes.length === 0 ? true : filters.caseTypes.includes(s.caseType))
            )
        })
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

    calculateStartOfHearing(session: SessionViewModel) {
        let duration = moment.duration();
        session.hearingParts.forEach(hp => duration.add(hp.duration));

        return moment(session.start).add(duration).toDate();
    }

    selectSession(session: SessionViewModel) {
        this.selectedSession = session;
    }

    assignButtonEnabled() {
        return (this.selectedHearingPartId !== '') && (this.selectedSession.id);
    }
}
