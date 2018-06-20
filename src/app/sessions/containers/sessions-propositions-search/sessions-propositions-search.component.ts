import { Component, OnInit } from '@angular/core';
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as RoomActions from '../../../rooms/actions/room.action';
import * as SessionActions from '../../../sessions/actions/session.action';
import { State } from '../../../app.state';
import { select, Store } from '@ngrx/store';
import * as fromRooms from '../../../rooms/reducers/room.reducer';
import { Judge } from '../../../judges/models/judge.model';
import { map } from 'rxjs/operators';
import * as fromSessionIndex from '../../reducers';
import { Room } from '../../../rooms/models/room.model';
import { Observable } from 'rxjs/Observable';
import * as fromJudges from '../../../judges/reducers';
import { SessionPropositionQuery } from '../../models/session-proposition-query.model';
import { SessionPropositionView } from '../../models/session-proposition-view.model';

@Component({
  selector: 'app-sessions-propositions-search',
  templateUrl: './sessions-propositions-search.component.html',
  styleUrls: ['./sessions-propositions-search.component.scss']
})
export class SessionsPropositionsSearchComponent implements OnInit {

  judges$: Observable<Judge[]>;
  rooms$: Observable<Room[]>;
  sessionPropositions$: Observable<any>;
  judgesLoading$: Observable<boolean>;
  roomsLoading$: Observable<boolean>;

  constructor(private store: Store<State>) {
    this.rooms$ = this.store.pipe(select(fromSessionIndex.getRooms), map(this.asArray)) as Observable<Room[]>;
    this.judges$ = this.store.pipe(select(fromJudges.getJudges), map(this.asArray)) as Observable<Judge[]>;
    this.sessionPropositions$ = this.store.pipe(select(fromSessionIndex.getFullSessionPropositions), map(this.asArray));
    this.roomsLoading$ = this.store.pipe(select(fromRooms.getLoading));
    this.judgesLoading$ = this.store.pipe(select(fromJudges.getJudgesLoading));
  }

  ngOnInit() {
    this.store.dispatch(new RoomActions.Get());
    this.store.dispatch(new JudgeActions.Get());
  }

  private asArray(data) {
    return Object.values(data) || [];
  }

  search(searchRequest: SessionPropositionQuery) {
    this.store.dispatch(new SessionActions.SearchPropositions(searchRequest));
  }

  onSessionCreate(spv: SessionPropositionView) {
    // TODO implement the create session dialog with populated fields
    console.log(spv);
  }

}
