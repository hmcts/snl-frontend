import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { SessionViewModel } from '../../models/session.viewmodel';

@Component({
  selector: 'app-session-amendment-table',
  templateUrl: './session-amendment-table.component.html',
  styleUrls: ['./session-amendment-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionAmendmentTableComponent implements OnChanges {

  @Input() sessions: SessionViewModel[];
  @Output() amend = new EventEmitter();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns = [
      'id',
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
      'amend'
  ];

  dataSource: MatTableDataSource<any>;
  tableVisible;

  constructor() {
    this.dataSource = new MatTableDataSource(this.sessions);
  }

  parseTime(date: moment.Moment) {
    return date.format('HH:mm');
  }

  humanizeDuration(duration) {
      return moment.utc(moment.duration(duration).asMilliseconds()).format('HH:mm');
  }

  ngOnChanges() {
      if (this.sessions) {
          if (this.sessions.length === 0) {
              this.tableVisible = false;
              return;
          }
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
