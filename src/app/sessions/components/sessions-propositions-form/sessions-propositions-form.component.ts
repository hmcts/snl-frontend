import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Judge } from '../../../judges/models/judge.model';
import { Room } from '../../../rooms/models/room.model';
import { SessionPropositionQuery } from '../../models/session-proposition-query.model';

@Component({
  selector: 'app-sessions-propositions-form',
  templateUrl: './sessions-propositions-form.component.html',
  styleUrls: ['./sessions-propositions-form.component.scss']
})
export class SessionsPropositionsFormComponent implements OnInit {

  searchParams = {
      from: new Date(),
      to: new Date(),
      durationInMinutes: 1,
      roomId: null,
      judgeId: null
  } as SessionPropositionQuery;

  @Input() judges: Judge[];
  @Input() rooms: Room[];
  @Input() roomsLoading: boolean;
  @Input() judgesLoading: boolean;

  @Output() searchProposition = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  search() {
    this.searchProposition.emit(this.searchParams);
  }

}
