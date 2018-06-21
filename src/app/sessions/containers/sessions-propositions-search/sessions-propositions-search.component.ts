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
import { combineLatest } from 'rxjs/observable/combineLatest';
import * as moment from 'moment';
import { SessionEditOrCreateDialogComponent } from '../../components/session-edit-or-create-dialog/session-edit-or-create-dialog.component';
import { SessionCreate } from '../../models/session-create.model';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-sessions-propositions-search',
  templateUrl: './sessions-propositions-search.component.html',
  styleUrls: ['./sessions-propositions-search.component.scss']
})
export class SessionsPropositionsSearchComponent implements OnInit {

  filterData: SessionPropositionQuery;
  judges$: Observable<Judge[]>;
  rooms$: Observable<Room[]>;
  sessionPropositions$: Observable<any>;
  judgesLoading$: Observable<boolean>;
  roomsLoading$: Observable<boolean>;
  filterDataLoading$: Observable<boolean | false>;
  sessionPropositionsLoading$: Observable<boolean | false>;

  constructor(private store: Store<State>,
              private dialog: MatDialog
  ) {
    this.rooms$ = this.store.pipe(select(fromSessionIndex.getRooms), map(this.asArray)) as Observable<Room[]>;
    this.judges$ = this.store.pipe(select(fromJudges.getJudges), map(this.asArray)) as Observable<Judge[]>;
    this.sessionPropositions$ = this.store.pipe(select(fromSessionIndex.getFullSessionPropositions), map(this.asArray));
    this.sessionPropositionsLoading$ = this.store.pipe(select(fromSessionIndex.getSessionsLoading));
    this.roomsLoading$ = this.store.pipe(select(fromRooms.getLoading));
    this.judgesLoading$ = this.store.pipe(select(fromJudges.getJudgesLoading));
    this.filterDataLoading$ = combineLatest(
        this.roomsLoading$, this.judgesLoading$, (r, j) => { return r || j ; }
        )
  }

  ngOnInit() {
    this.store.dispatch(new RoomActions.Get());
    this.store.dispatch(new JudgeActions.Get());
  }

  private asArray(data) {
    return Object.values(data) || [];
  }

  search(searchRequest: SessionPropositionQuery) {
    this.filterData = searchRequest;
    this.store.dispatch(new SessionActions.SearchPropositions(searchRequest));
  }

  onSessionCreate(spv: SessionPropositionView) {
      let durationInSeconds = 0;
      if ( this.filterData !== undefined ) {
          durationInSeconds = this.filterData.durationInMinutes * 60;
      }
      return this.dialog.open(SessionEditOrCreateDialogComponent, {
          width: 'auto',
          minWidth: 350,
          data: {
              userTransactionId: undefined,
              id: undefined,
              start: moment(spv.date).add(moment.duration(spv.startTime as string)).toDate(),
              duration: durationInSeconds,
              roomId: spv.room.id,
              personId: spv.judge.id,
              caseType: undefined
          } as SessionCreate,
          hasBackdrop: true
      });
  }

}
