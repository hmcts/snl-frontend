import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as SessionActions from '../../actions/session.action';
import { Judge } from '../../../judges/models/judge.model';
import { Room } from '../../../rooms/models/room.model';
import { State } from '../../../app.state';
import { Observable } from 'rxjs/Observable';
import * as fromRooms from '../../../rooms/reducers/room.reducer';
import { Session } from '../../models/session.model';

@Component({
  selector: 'app-sessions-create',
  templateUrl: './sessions-create.component.html',
  styleUrls: ['./sessions-create.component.scss']
})
export class SessionsCreateComponent implements OnInit {

  rooms$: Observable<Room[]>;
  session: Session;

  constructor(private store: Store<State>) {
    this.rooms$ = this.store.pipe(select(fromRooms.getRoomsEntities));
    this.session = {
      start: new Date(),
      duration: '',
      roomId: 0,
      judgeId: 0,
      jurisdiction: ''
    };
  }

  create() {
      this.store.dispatch(new SessionActions.Create(this.session))
  }

  ngOnInit() {
  }
}

export class SessionCreationModel {
  date: Date;
  startTime: Date;
  endTime: Date;
  caseType: String;
  judgeId: String;
  roomId: String;
}
