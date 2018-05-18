import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Judge } from '../../../judges/models/judge.model';
import { Room } from '../../../rooms/models/room.model';
import * as RoomActions from '../../../rooms/actions/room.action';
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as fromRooms from '../../../rooms/reducers/room.reducer';
import { select, Store } from '@ngrx/store';
import * as fromSessions from '../../reducers';
import * as fromJudges from '../../../judges/reducers';
import { State } from '../../../app.state';

@Component({
  selector: 'app-sessions-filter',
  templateUrl: './sessions-filter.component.html',
  styleUrls: ['./sessions-filter.component.scss']
})
export class SessionsFilterComponent implements OnInit {

  @Output() selectFilters = new EventEmitter();

  rooms: Room[];
  judges: Judge[];
  roomsLoading$: Observable<boolean>;
  judgesLoading$: Observable<boolean>;
  roomsPlaceholder: String;
  judgesPlaceholder: String;
  filters = [];
  caseTypes;

  constructor(private store: Store<State>) {
      this.store.pipe(select(fromSessions.getRooms)).subscribe(data => this.rooms = Object.values(data));
      this.store.pipe(select(fromJudges.getJudges)).subscribe(data => this.judges = Object.values(data));
      this.roomsLoading$ = this.store.pipe(select(fromRooms.getLoading));
      this.judgesLoading$ = this.store.pipe(select(fromJudges.getJudgesLoading));
      this.store.pipe(select(fromRooms.getRooms)).subscribe(console.log);
      this.caseTypes = ['SCLAIMS', 'FTRACK', 'MTRACK'];
      this.roomsLoading$.subscribe(isLoading => { this.roomsPlaceholder = isLoading ? 'Loading the rooms...' : 'Select the room'; });
      this.judgesLoading$.subscribe(isLoading => { this.judgesPlaceholder = isLoading ? 'Loading the judges...' : 'Select the judge'; });
  }

  ngOnInit() {
    this.store.dispatch(new RoomActions.Get());
    this.store.dispatch(new JudgeActions.Get());
  }

  sendFilter() {
    this.selectFilters.emit((this.filters == null) ? null : this.filters)
  }
}
