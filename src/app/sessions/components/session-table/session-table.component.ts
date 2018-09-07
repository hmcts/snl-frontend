import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { SessionViewModel } from '../../models/session.viewmodel';

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
  @ViewChild(MatPaginator) paginator: MatPaginator;

  selectedSesssion;
  displayedColumns = [
      'select session',
      'person',
      'time',
      'date',
      'duration',
      'room',
      'sessionType',
      'hearingParts',
      'allocated',
      'utilization',
      'available',
  ];

  dataSource: MatTableDataSource<any>;
  tableVisible;

  constructor() {
    this.selectedSesssion = new SelectionModel<SessionViewModel>(false, []);

    this.tableVisible = false;

    this.dataSource = new MatTableDataSource(this.sessions);
  }

  parseTime(date: moment.Moment) {
    return date.format('HH:mm');
  }

  humanizeDuration(duration) {
      return moment.utc(moment.duration(duration).asMilliseconds()).format('HH:mm');
  }

  toggleSession(session: SessionViewModel) {
    this.selectedSesssion.toggle(session);
    this.selectSession.emit(this.selectedSesssion.isSelected(session) ? session : {})
  }

  ngOnChanges() {
      if (this.sessions) {
          this.tableVisible = true;
          this.dataSource = new MatTableDataSource(this.sessions);

          this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                  case 'person':
                      return getPropertyMemberOrNull(item, property, 'name');
                  case 'room':
                      return getPropertyMemberOrNull(item, property, 'name');
                  case 'sessionType':
                      const description = getPropertyMemberOrNull(item, property, 'description');
                      if (description === 'N/A') {
                          return null;
                      } else {
                        return description;
                      }
                  case 'hearingParts':
                      return getPropertyMemberOrNull(item, property, 'length');
                  case 'time':
                  case 'date':
                      return item['start'].unix();
                  case 'duration':
                  case 'allocated':
                  case 'available':
                      return moment.duration(item[property]).asMilliseconds();
                  default:
                      return item[property];
              }
          };

          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
      }
  }
}

function getPropertyMemberOrNull(item: object, property: string, key: string ) {
    return (item[property]) ? item[property][key] : null;
}
