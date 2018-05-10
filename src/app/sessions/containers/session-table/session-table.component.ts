import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material';
import * as fromSessions from '../../reducers/session.reducer';
import * as moment from 'moment';

@Component({
  selector: 'app-session-table',
  templateUrl: './session-table.component.html',
  styleUrls: ['./session-table.component.css']
})
export class SessionTableComponent implements OnInit {

  displayedColumns = ['position', 'time', 'duration', 'room'];
  dataSource;
  tableVisible;

  constructor(private store: Store<fromSessions.State>) {
    this.tableVisible = false;

    this.store.pipe(select(fromSessions.getSessionsWithRoomsAndJudges)).subscribe(data => {
      this.tableVisible = false;
      if (data) {
        data = Object.values(data);
        this.tableVisible = data.length !== 0;
        data.map(element => {
          element.start = new Date(element.start);
        });
        this.dataSource = new MatTableDataSource(data);
      }
    });
  }

  humanizeDuration(duration) {
      return moment.duration(duration).humanize();
  }

  ngOnInit() {
  }

}
