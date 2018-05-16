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
import { schema } from 'normalizr';
import { SessionViewModel } from '../../models/session.viewmodel';

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
    selectedSession: any;
    selectedHearingPartId;

    constructor(private store: Store<fromHearingParts.State>) {
        this.store.pipe(select(fromHearingParts.getHearingPartsEntities)).subscribe(data => {
            this.hearingParts$ = Observable.of(data ? Object.values(data) : []);
        });
        this.sessions$ = this.store.pipe(select(fromSessions.getFullSessions));
        this.startDate = moment().toDate();
        this.endDate = moment().add(5, 'years').toDate();
        this.selectedHearingPartId = '';
        this.selectedSession = {} ;
    }

    ngOnInit() {
        this.store.dispatch(new SearchForDates({startDate: this.startDate, endDate: this.endDate}));
        this.store.dispatch(new fromHearingPartsActions.Search());
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
