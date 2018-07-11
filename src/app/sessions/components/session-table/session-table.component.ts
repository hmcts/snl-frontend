import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { SessionViewModel } from '../../models/session.viewmodel';
import { SessionsStatisticsService } from '../../services/sessions-statistics-service';

@Component({
  selector: 'app-session-table',
  templateUrl: './session-table.component.html',
  styleUrls: ['./session-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionTableComponent implements OnInit, OnChanges {

  @Output()
  selectSession = new EventEmitter();

  @Input() sessions: SessionViewModel[];

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
  dataSource: MatTableDataSource<any>;
  tableVisible;

  constructor(private readonly sessionsStatsService: SessionsStatisticsService) {
    this.selectedSesssion = new SelectionModel<SessionViewModel>(false, []);

    this.tableVisible = false;

    this.dataSource = new MatTableDataSource(this.sessions);
  }

  parseDate(date) {
      return moment(date).format('DD/MM/YYYY');
  }

  humanizeDuration(duration) {
      return moment.duration(duration).humanize();
  }

  calculateUtilized(duration: string, allocated: moment.Duration) {
    return this.sessionsStatsService.calculateUtilizedDuration(moment.duration(duration), allocated);
  }

  calculateAllocated(session) {
    return this.sessionsStatsService.calculateAllocatedHearingsDuration(session);
  }

  calculateAvailable(duration: string, allocated: moment.Duration) {
    return this.sessionsStatsService.calculateAvailableDuration(moment.duration(duration), allocated);
  }

  toggleSession(session) {
    this.selectedSesssion.toggle(session);
    this.selectSession.emit(this.selectedSesssion.isSelected(session) ? session : {})
  }

  ngOnInit() {
  }

  ngOnChanges() {
      if (this.sessions) {
          this.tableVisible = true;

          this.sessions.map(element => {
              element.start = new Date(element.start);
          });
          this.dataSource = new MatTableDataSource(this.sessions);
      }

  }

}
