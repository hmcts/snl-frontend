import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Search } from '../../actions/session.action';
import { DatePipe } from '@angular/common';
import * as fromSessions from '../../reducers/session.reducer';
import { HearingPart } from '../../../hearing-part/models/hearing-part';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-sessions-search',
  templateUrl: './sessions-search.component.html',
  styleUrls: ['./sessions-search.component.scss']
})
export class SessionsSearchComponent implements OnInit {

    chosenDate;
    hearingParts$: Observable<HearingPart[]>;

    constructor(private store: Store<fromSessions.State>) { }

    ngOnInit() {
        this.hearingParts$ = Observable.of([
            {
                id: 'asd',
                caseNumber: 'asd',
                caseType: 'asd',
                hearingType: 'asd',
                duration: moment.duration('10'),
                scheduleStart: new Date(),
                scheduleEnd: new Date(),
            } as HearingPart
        ])
    }

    getSessions(date) {
        date = new DatePipe('en-US').transform(date, 'dd-MM-yyyy');

        this.store.dispatch(new Search({date: date}));
    }

    assignToSession(event) {
        console.log(event);
    }

}
