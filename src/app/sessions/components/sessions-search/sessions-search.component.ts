import { Component, OnInit } from '@angular/core';
import { State } from '../../../app.state';
import { Store } from '@ngrx/store';
import { Search } from '../../actions/session.action';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sessions-search',
  templateUrl: './sessions-search.component.html',
  styleUrls: ['./sessions-search.component.scss']
})
export class SessionsSearchComponent implements OnInit {

    chosenDate;

    constructor(private store: Store<State>) { }

    ngOnInit() {
    }

    getSessions(date) {
        date = new DatePipe('en-US').transform(date, 'dd-MM-yyyy');

        this.store.dispatch(new Search({date: date}));
    }

}
