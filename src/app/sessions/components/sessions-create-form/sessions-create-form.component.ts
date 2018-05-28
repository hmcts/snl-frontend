import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Judge } from '../../../judges/models/judge.model';
import { Room } from '../../../rooms/models/room.model';
import { SessionCreate } from '../../models/session-create.model';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-sessions-create-form',
  templateUrl: './sessions-create-form.component.html',
  styleUrls: ['./sessions-create-form.component.scss']
})
export class SessionsCreateFormComponent implements OnInit, OnChanges {

  session;
  durationInMinutes: Number;
  caseTypes;
  time;
  roomsPlaceholder;
  judgesPlaceholder;

  @Input() judges: Judge[];
  @Input() rooms: Room[];
  @Input() roomsLoading: boolean;
  @Input() judgesLoading: boolean;

  @Output() createSession = new EventEmitter();

  constructor() {
      this.session = {
          id: undefined,
          start: new Date(),
          duration: 0,
          roomId: null,
          personId: null,
          caseType: null,
      } as SessionCreate;

      this.caseTypes = ['SCLAIMS', 'FTRACK', 'MTRACK'];
      this.durationInMinutes = 30;
      this.time = moment().format('HH:mm');
  }

  ngOnInit() {
  }

  ngOnChanges() {
      this.roomsPlaceholder = this.roomsLoading ? 'Loading the rooms...' : 'Select the room';
      this.judgesPlaceholder = this.judgesLoading ? 'Loading the judges...' : 'Select the judge';
  }

  create() {
      this.session.id = uuid();
      let time_arr = this.time.split(':');
      this.session.start.setHours(time_arr[0]);
      this.session.start.setMinutes(time_arr[1]);
      this.session.duration = this.durationInMinutes.valueOf() * 60;

      this.createSession.emit(this.session);
  }

}
