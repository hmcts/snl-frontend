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

  displayedColumns = ['position', 'name', 'time', 'jurisdiction'];
  dataSource;

  constructor(private store: Store<fromSessions.State>) {

    this.store.pipe(select(fromSessions.getSessionsEntitiesState)).subscribe(data => {
      console.log(data);
      if (data && data.map) {
        data.map(element => { element.date = new Date(element.date); });
        this.dataSource = new MatTableDataSource(data);
      }
    });
  }

  ngOnInit() {
  }

}
