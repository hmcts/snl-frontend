import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-session-table',
  templateUrl: './session-table.component.html',
  styleUrls: ['./session-table.component.css']
})
export class SessionTableComponent implements OnInit {

  displayedColumns = ['position', 'time', 'duration'];
  dataSource;

  constructor(private store: Store<AppState>) {

    this.store.pipe(select(state => state.sessionsReducer.sessions)).subscribe(data => {
      if (data) {
        data.map(element => { element.start = new Date(element.start); });
        this.dataSource = new MatTableDataSource(data);
      }
    });
  }

  ngOnInit() {
  }

}
