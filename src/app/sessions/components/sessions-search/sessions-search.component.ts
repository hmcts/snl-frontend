import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Search } from '../../actions/session.action';
import { DatePipe } from '@angular/common';
import * as fromSessions from '../../reducers/session.reducer';

@Component({
  selector: 'app-sessions-search',
  templateUrl: './sessions-search.component.html',
  styleUrls: ['./sessions-search.component.scss']
})
export class SessionsSearchComponent implements OnInit {

    chosenDate;

    constructor(private store: Store<fromSessions.State>) { }

    ngOnInit() {
    }

    getSessions(date) {
        date = new DatePipe('en-US').transform(date, 'dd-MM-yyyy');

        this.store.dispatch(new Search({date: date}));
    }

}
