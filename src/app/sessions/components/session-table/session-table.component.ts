import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material';
import * as fromSessions from '../../reducers/index';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { SessionViewModel } from '../../models/session.viewmodel';
import { SessionsStatisticsService } from '../../services/sessions-statistics-service';

interface SessionTableData extends SessionViewModel {
    utilized: number,
    allocated: string,
    startDate: string,
    available: number,
    humanizedDuration: string,
    personName: string,
    roomName: string,
    time: string
}

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
  tableData: SessionTableData[];

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
      //'select session'
  ];
  dataSource: MatTableDataSource<any>;
  tableVisible;

  constructor(private store: Store<fromSessions.State>,
              private sessionsStatsService: SessionsStatisticsService) {
    this.selectedSesssion = new SelectionModel<SessionViewModel>(false, []);

    this.tableVisible = false;

    this.dataSource = new MatTableDataSource(this.tableData);
  }

  parseDate(date) {
      return moment(date).format('DD/MM/YYYY');
  }

  humanizeDuration(duration) {
      return moment.duration(duration).humanize();
  }

  calculateUtilized(duration: number, allocated: moment.Duration) {
    return this.sessionsStatsService.calculateUtilizedDuration(moment.duration(duration), allocated);
  }

  calculateAllocated(session) {
    return this.sessionsStatsService.calculateAllocatedHearingsDuration(session);
  }

  calculateAvailable(duration: number, allocated: moment.Duration) {
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

          let t0 = performance.now();

          this.tableData = this.sessions.map((element: SessionViewModel) => {
              let tableRow: SessionTableData;
              let allocated = this.calculateAllocated(element.duration);
              let startDate = new Date(element.start);
              tableRow = {...element,
                  personName: element.person !== undefined ? element.person.name : '',
                  roomName: element.room !== undefined ? element.room.name : '',
                  startDate: this.parseDate(startDate),
                  allocated: allocated.humanize(),
                  humanizedDuration: moment.duration(element.duration).humanize(),
                  available: this.calculateAvailable(element.duration, allocated),
                  utilized: this.calculateUtilized(element.duration, allocated),
                  time: `${startDate.getHours()}:${(startDate.getMinutes() < 10 ? '0' : '') + startDate.getMinutes()}`
              };
              return tableRow;
          });
          this.dataSource = new MatTableDataSource(this.tableData);

          let t1 = performance.now();

          console.log(`Table performance: ${t0 - t1}`);
      }

  }

}
