import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as SessionActions from '../../actions/session.action';
import { Judge } from '../../../judges/models/judge.model';
import { Room } from '../../../rooms/models/room.model';
import { State } from '../../../app.state';
import { Observable } from 'rxjs/Observable';
import * as fromRooms from '../../../rooms/reducers/room.reducer';
import * as fromJudges from '../../../judges/reducers/judge.reducer';
import { Session } from '../../models/session.model';
import { v4 as uuid } from 'uuid';
import { SessionCreate } from '../../models/session-create.model';

@Component({
  selector: 'app-sessions-create',
  templateUrl: './sessions-create.component.html',
  styleUrls: ['./sessions-create.component.scss']
})
export class SessionsCreateComponent implements OnInit {
    rooms$: Observable<Room[]>;
    judges$: Observable<Judge[]>;
    caseTypes;

    session: SessionCreate;

    constructor(private store: Store<State>) {
    this.rooms$ = this.store.pipe(select(fromRooms.getRoomsEntities));
    this.judges$ = this.store.pipe(select(fromJudges.getJudgesEntities));
    this.caseTypes = ['SCLAIMS', 'FTRACK', 'MTRACK'];

    this.session = {
        id: undefined,
        start: undefined,
        duration: 0,
        roomId: undefined,
        personId: undefined,
        caseType: null
    } as SessionCreate;
  }

  create() {
    this.session.id = uuid();
    this.store.dispatch(new SessionActions.Create(this.session))
  }

  ngOnInit() {
  }
}
