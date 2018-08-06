import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
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
export class SessionTableComponent implements OnChanges {

  @Output()
  selectSession = new EventEmitter();

  @Input() sessions: SessionViewModel[];
  @ViewChild(MatSort) sort: MatSort;

  selectedSesssion;
  displayedColumns = [
      'person',
      'time',
      'date',
      'duration',
      'room',
      'caseType',
      'hearingParts',
      'allocated',
      'utilization',
      'available',
      'select session'
  ];

  dataSource: MatTableDataSource<any>;
  tableVisible;

  constructor(private readonly sessionsStatsService: SessionsStatisticsService) {
    this.selectedSesssion = new SelectionModel<SessionViewModel>(false, []);

    this.tableVisible = false;

    this.dataSource = new MatTableDataSource(this.decorateSessions(this.sessions));
  }

  parseTime(date: moment.Moment) {
    return date.format('HH:mm');
  }

  humanizeDuration(duration) {
      return moment.duration(duration).humanize();
  }

  calculateUtilized(duration: number, allocated: moment.Duration): number {
    return this.sessionsStatsService.calculateUtilizedDuration(moment.duration(duration), allocated);
  }

  calculateAllocated(session: SessionViewModel) {
    return this.sessionsStatsService.calculateAllocatedHearingsDuration(session);
  }

  calculateAvailable(duration: number, allocated: moment.Duration) {
    return this.sessionsStatsService.calculateAvailableDuration(moment.duration(duration), allocated);
  }

  toggleSession(session: SessionViewModel) {
    this.selectedSesssion.toggle(session);
    this.selectSession.emit(this.selectedSesssion.isSelected(session) ? session : {})
  }

  ngOnChanges() {
      if (this.sessions) {
          this.tableVisible = true;
          this.dataSource = new MatTableDataSource(this.decorateSessions(this.sessions));

          this.dataSource.sortingDataAccessor = (item, property) => {
              console.log(item);

              switch (property) {
                  case 'person':
                      return getPropertyMemberOrNull(item, property, 'name');
                  case 'room':
                      return getPropertyMemberOrNull(item, property, 'name');
                  case 'hearingParts':
                      return getPropertyMemberOrNull(item, property, 'length');
                  case 'time':
                  case 'date':
                      return item['start'].unix();
                  default:
                      return item[property];
              }
          }

          this.dataSource.sort = this.sort;
      }
  }

  ngAfterViewInit() {
      this.dataSource.sort = this.sort;
  }

    private decorateSessions(sessions: SessionViewModel[]) {
        if (sessions === undefined) {
            return sessions;
        }

        return sessions.map(session => {
            session.allocated = this.calculateAllocated(session);
            session.utilization = this.calculateUtilized(session.duration, session.allocated);
            session.available = this.calculateAvailable(session.duration, session.allocated);

            return session;
        });
    }
}

function getPropertyMemberOrNull(item :object, property :string, key :string) {
    return item[property] !== undefined ? item[property][key] : null;
}

