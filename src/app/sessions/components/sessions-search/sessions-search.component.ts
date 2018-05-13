import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Search, SearchForDates, SessionActionTypes } from '../../actions/session.action';
import { DatePipe } from '@angular/common';
import { HearingPart } from '../../../hearing-part/models/hearing-part';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { State } from '../../../app.state';
import * as fromHearingParts from '../../../hearing-part/reducers/index';
import * as fromHearingParts2 from '../../../hearing-part/reducers/hearing-part.reducer';
import * as fromSessions from '../../reducers';
import * as fromRoms from '../../../rooms/reducers/room.reducer';
import * as fromHearingPartsActions from '../../../hearing-part/actions/hearing-part.action';

import { AssignToSession } from '../../../hearing-part/actions/hearing-part.action';
import { SessionAssignment } from '../../../hearing-part/models/session-assignment';
import * as moment from 'moment';
import { normalize, schema } from 'normalizr';
import { SessionViewModel } from '../../models/session.viewmodel';
import { MatSnackBar } from '@angular/material';
import { HearingPartActionTypes } from '../../../hearing-part/actions/hearing-part.action';
import { Actions, ofType } from '@ngrx/effects';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as roomActions from '../../../rooms/actions/room.action';
import * as sessionActions from '../../actions/session.action';
import * as judgeActions from '../../../judges/actions/judge.action';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sessions-search',
  templateUrl: './sessions-search.component.html',
  styleUrls: ['./sessions-search.component.scss']
})
export class SessionsSearchComponent implements OnInit {

    chosenDate;
    hearingParts$: Observable<HearingPart[]>;
    sessions$: Observable<SessionViewModel[]>;

    constructor(private store: Store<fromHearingParts.State>, private actions$: Actions) {
        this.store.pipe(select(fromHearingParts.getHearingPartsEntities)).subscribe(data => {
            this.hearingParts$ = Observable.of(data ? Object.values(data) : []);
        });
        this.sessions$ = this.store.pipe(select(fromSessions.getFullSessions));
    }

    ngOnInit() {
        let start = moment().toDate();
        let end = moment().add(10, 'years').toDate();
        this.store.dispatch(new SearchForDates({startDate: start, endDate: end}));
        this.store.dispatch(new fromHearingPartsActions.Search());
    }

    getSessions(date) {
        date = new DatePipe('en-US').transform(date, 'dd-MM-yyyy');

        this.store.dispatch(new Search({date: date}));
    }

    assignToSession(event: SessionAssignment) {
        this.store.dispatch(new AssignToSession(event));
    }


}

