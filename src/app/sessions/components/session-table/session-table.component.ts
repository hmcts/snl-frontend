import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { SessionViewModel } from '../../models/session.viewmodel';
import { formatDuration } from '../../../utils/date-utils';
import { DEFAULT_SESSION_FILTERS, SessionFilters } from '../../models/session-filter.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-session-table',
  templateUrl: './session-table.component.html',
  styleUrls: ['./session-table.component.scss']
})
export class SessionTableComponent implements OnChanges, OnInit {
    public static DEFAULT_PAGING: PageEvent = {
        pageSize: 10,
        pageIndex: 0,
        length: undefined
    };

  paginationSource$: BehaviorSubject<PageEvent> = new BehaviorSubject<PageEvent>(SessionTableComponent.DEFAULT_PAGING);

  @Output() selectSessions = new EventEmitter();
  @Output() viewNotes = new EventEmitter();

  @Input() sessions: SessionViewModel[];
  @Input() totalCount: number;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  selectedSesssions: SelectionModel<SessionViewModel>;
  displayedColumns = [
      'sessionType',
      'date',
      'time',
      'person',
      'room',
      'hearingParts',
      'utilization',
      'notes',
      'available',
      'duration',
      'allocated',
      'select session'
  ];

  dataSource: MatTableDataSource<any>;
  tableVisible;

  constructor() {
    this.selectedSesssions = new SelectionModel<SessionViewModel>(true, []);

    this.tableVisible = false;

    this.dataSource = new MatTableDataSource(this.sessions);
  }

  hasNotes(session: SessionViewModel): boolean {
      return session.notes.length > 0;
  }

  showNotes(session: SessionViewModel): void {
      if (this.hasNotes(session)) {
          this.viewNotes.emit(session);
      }
  }

  parseTime(date: moment.Moment) {
    return date.format('HH:mm');
  }

  humanizeDuration(duration) {
      return formatDuration(moment.duration(duration));
  }

  toggleSession(session: SessionViewModel) {
    this.selectedSesssions.toggle(session);
    this.selectSessions.emit(this.selectedSesssions.selected)
  }

  clearSelection() {
      this.selectedSesssions.clear();
  }

  ngOnInit() {
      this.dataSource = new MatTableDataSource(Object.values(this.sessions));
      this.paginator.page.subscribe(pageEvent => this.paginationSource$.next(pageEvent))
  }

  getPaginationSource() {
      return this.paginationSource$;
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
