import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Judge } from '../../../judges/models/judge.model';
import { Room } from '../../../rooms/models/room.model';
import { SessionFilter } from '../../models/session-filter.model';

@Component({
  selector: 'app-sessions-filter',
  templateUrl: './sessions-filter.component.html',
  styleUrls: ['./sessions-filter.component.scss']
})
export class SessionsFilterComponent implements OnInit {

  @Output() filter = new EventEmitter();

  @Input() rooms: Room[];
  @Input() judges: Judge[];
  roomsPlaceholder: String;
  judgesPlaceholder: String;
  filters: SessionFilter;
  caseTypes;

  constructor() {
      this.caseTypes = ['SCLAIMS', 'FTRACK', 'MTRACK'];
      this.roomsPlaceholder = 'Select the room';
      this.judgesPlaceholder = 'Select the judge';
      this.filters = {
          caseTypes: [],
          rooms: [],
          judges: [],
      } as SessionFilter;
  }

  ngOnInit() {
  }

  sendFilter() {
    this.filter.emit((this.filters == null) ? null : this.filters)
  }
}
