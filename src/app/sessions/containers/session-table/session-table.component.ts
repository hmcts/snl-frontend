import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material';
import * as fromSessions from '../../reducers';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { SessionViewModel } from '../../models/session.viewmodel';
import { SessionsStatisticsService } from '../../services/sessions-statistics-service';

@Component({
  selector: 'app-session-table',
  templateUrl: './session-table.component.html',
  styleUrls: ['./session-table.component.css']
})
export class SessionTableComponent implements OnInit {

  @Output()
  selectSession = new EventEmitter();

  selectedSesssion;
  displayedColumns = [
      'position',
      'date',
      'time',
      'duration',
      'room',
      'casetype',
      'hearings',
      'allocated',
      'utilisation',
      'available',
      'select session'
  ];
  dataSource;
  tableVisible;

  constructor(private store: Store<fromSessions.State>,
              private sessionsStatsService: SessionsStatisticsService) {
    this.selectedSesssion = new SelectionModel<SessionViewModel>(false, []);

    this.tableVisible = false;

    this.store.pipe(select(fromSessions.getFullSessions)).subscribe(data => {
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

  parseDate(date) {
      return moment(date).format('DD/MM/YYYY');
  }

  humanizeDuration(duration) {
      return moment.duration(duration).humanize();
  }

  calculateAllocated(session) {
    return this.sessionsStatsService.calculateAllocated(session);
  }

  calculateUtilized(duration: string, allocated: moment.Duration) {
    return this.sessionsStatsService.calculateUtilized(duration, allocated);
  }

  calculateAvailable(duration: string, allocated: moment.Duration) {
    return this.sessionsStatsService.calculateAvailable(duration, allocated);
  }

  toggleSession(session) {
    this.selectedSesssion.toggle(session);
    this.selectSession.emit(this.selectedSesssion.isSelected(session) ? session : {})
  }

  ngOnInit() {
  }

}
