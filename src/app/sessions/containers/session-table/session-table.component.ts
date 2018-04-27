import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material';
import * as fromSessions from '../../reducers/session.reducer';

@Component({
  selector: 'app-session-table',
  templateUrl: './session-table.component.html',
  styleUrls: ['./session-table.component.css']
})
export class SessionTableComponent implements OnInit {

  displayedColumns = ['position', 'time', 'duration'];
  dataSource;

  constructor(private store: Store<fromSessions.State>) {

    this.store.pipe(select(fromSessions.getSessionsEntities)).subscribe(data => {
      if (data && data.map) {
        data.map(element => { element.start = new Date(element.start); });
        this.dataSource = new MatTableDataSource(data);
      }
    });
  }

  ngOnInit() {
  }

}
