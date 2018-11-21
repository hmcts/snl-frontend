import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Judge } from '../../../judges/models/judge.model';
import { Room } from '../../../rooms/models/room.model';
import { DEFAULT_SESSION_FILTERS, SessionFilters } from '../../models/session-filter.model';
import * as moment from 'moment'
import { SessionType } from '../../../core/reference/models/session-type';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-sessions-filter',
  templateUrl: './sessions-filter.component.html',
  styleUrls: ['./sessions-filter.component.scss']
})
export class SessionsFilterComponent implements OnInit {
  filterSource$: BehaviorSubject<SessionFilters> = new BehaviorSubject<SessionFilters>(DEFAULT_SESSION_FILTERS);

  @Output() filter = new EventEmitter();

  @Input() rooms: Room[];
  @Input() judges: Judge[];
  @Input() sessionTypes: SessionType[];

  roomsPlaceholder: string;
  judgesPlaceholder: string;

  @Input() startDate: moment.Moment;
  @Input() endDate: moment.Moment;
  filters: SessionFilters;

  constructor() {
      this.roomsPlaceholder = 'Select the room';
      this.judgesPlaceholder = 'Select the judge';
  }

  ngOnInit() {
      this.filters = this.filterSource$.getValue();
  }

  sendFilter() {
    this.filter.emit(this.filters);
    this.filterSource$.next(this.filters);
  }
}
