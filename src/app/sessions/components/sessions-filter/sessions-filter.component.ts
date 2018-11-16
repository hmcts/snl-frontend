import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Judge } from '../../../judges/models/judge.model';
import { Room } from '../../../rooms/models/room.model';
import { SessionFilters } from '../../models/session-filter.model';
import * as moment from 'moment'
import { CaseType } from '../../../core/reference/models/case-type';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sessions-filter',
  templateUrl: './sessions-filter.component.html',
  styleUrls: ['./sessions-filter.component.scss']
})
export class SessionsFilterComponent implements OnInit {

  @Output() filter = new EventEmitter();
  public readonly sessionFilter$ = new Subject<SessionFilters>();

  @Input() rooms: Room[];
  @Input() judges: Judge[];
  @Input() sessionTypes: CaseType[];
  @Input() startDate: moment.Moment;
  @Input() endDate: moment.Moment;

  roomsPlaceholder: string;
  judgesPlaceholder: string;
  filters: SessionFilters;

  ngOnInit() {
      this.filters = {
          sessionTypes: [],
          caseTypes: [],
          rooms: [],
          judges: [],
          startDate: this.startDate,
          endDate: this.endDate,
          utilization: {
              unlisted: {
                  active: false,
                  from: 0,
                  to: 0
              },
              partListed: {
                  active: false,
                  from: 1,
                  to: 99
              },
              fullyListed: {
                  active: false,
                  from: 100,
                  to: 100
              },
              overListed: {
                  active: false,
                  from: 101,
                  to: Infinity
              },
              custom: {
                  active: false,
                  from: 0,
                  to: 0
              }
          }
      } as SessionFilters;

      this.sendFilter();
  }

  sendFilter() {
    this.filter.emit(this.filters);
    this.sessionFilter$.next(this.filters);
  }
}
