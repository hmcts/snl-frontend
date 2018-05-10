import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Search, SearchForDates, SessionActionTypes } from '../../actions/session.action';
import { DatePipe } from '@angular/common';
import { HearingPart } from '../../../hearing-part/models/hearing-part';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { State } from '../../../app.state';
import * as fromHearingParts from '../../../hearing-part/reducers/hearing-part.reducer';
import * as fromSessions from '../../reducers/session.reducer';
import { Session } from '../../models/session.model';
import { AssignToSession } from '../../../hearing-part/actions/hearing-part.action';
import { SessionAssignment } from '../../../hearing-part/models/session-assignment';
import * as moment from 'moment';
import { normalize, schema } from 'normalizr';
import { SessionViewModel } from '../../models/session.viewmodel';

@Component({
  selector: 'app-sessions-search',
  templateUrl: './sessions-search.component.html',
  styleUrls: ['./sessions-search.component.scss']
})
export class SessionsSearchComponent implements OnInit {

    chosenDate;
    hearingParts$: Observable<HearingPart[]>;
    sessions$: Observable<SessionViewModel[]>;
    constructor(private store: Store<State>) {
        this.hearingParts$ = this.store.pipe(select(fromHearingParts.getHearingPartEntities));
        this.sessions$ = this.store.pipe(select(fromSessions.getSessionsWithRoomsAndJudges));
        this.sessions$.subscribe(console.log)
    }

    ngOnInit() {
        let start = moment().toDate();
        let end = moment().add(10, 'years').toDate();
        this.store.dispatch(new SearchForDates({startDate: start, endDate: end}))
    }

    getSessions(date) {
        date = new DatePipe('en-US').transform(date, 'dd-MM-yyyy');

        this.store.dispatch(new Search({date: date}));
    }

    assignToSession(event: SessionAssignment) {
        this.store.dispatch(new AssignToSession(event));
    }

}
