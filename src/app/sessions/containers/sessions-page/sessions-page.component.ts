import { Component, OnInit } from '@angular/core';
import { Search } from '../../../sessions/actions/session.action';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sessions-page',
  templateUrl: './sessions-page.component.html',
  styleUrls: ['./sessions-page.component.css']
})
export class SessionsPageComponent implements OnInit {

  chosenDate;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
  }

  getSessions(date) {
    date = new DatePipe('en-US').transform(date, 'yyyy-MM-dd');

    this.store.dispatch(new Search({date: date}));
  }

}
