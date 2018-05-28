import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as SessionActions from '../../actions/session.action';
import { Judge } from '../../../judges/models/judge.model';
import { Room } from '../../../rooms/models/room.model';
import { State } from '../../../app.state';
import { Observable } from 'rxjs/Observable';
import * as fromRooms from '../../../rooms/reducers/room.reducer';
import * as fromJudges from '../../../judges/reducers/index';
import * as fromProblems from '../../../problems/reducers/index';
import { v4 as uuid } from 'uuid';
import { SessionCreate } from '../../models/session-create.model';
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as RoomActions from '../../../rooms/actions/room.action';
import * as fromSessionIndex from '../../reducers/index';
import { SessionsCreateDialogComponent } from '../../components/sessions-create-dialog/sessions-create-dialog.component';
import { MatDialog } from '@angular/material';
import { SessionCreationSummary } from '../../models/session-creation-summary';
import { Problem } from '../../../problems/models/problem.model';
import { map, tap } from 'rxjs/operators';
import { Dictionary } from '@ngrx/entity/src/models';
import * as moment from 'moment';
import { ProblemViewmodel } from '../../../problems/models/problem.viewmodel';

@Component({
  selector: 'app-sessions-create',
  templateUrl: './sessions-create.component.html',
  styleUrls: ['./sessions-create.component.scss']
})
export class SessionsCreateComponent implements OnInit {
    rooms$: Observable<Room[]>;
    judges$: Observable<Judge[]>;
    sessionProblems$: Observable<ProblemViewmodel[]>;
    roomsLoading$: Observable<boolean>;
    judgesLoading$: Observable<boolean>;
    sessionsLoading$: Observable<boolean>;
    problemsLoading$: Observable<boolean>;
    roomsPlaceholder: String;
    judgesPlaceholder: String;
    durationInMinutes: Number;
    caseTypes;
    time;

    session: SessionCreate;

    constructor(private store: Store<State>, public dialog: MatDialog) {
    this.rooms$ = this.store.pipe(select(fromSessionIndex.getRooms), map(this.asArray)) as Observable<Room[]>;
    this.judges$ = this.store.pipe(select(fromJudges.getJudges), map(this.asArray)) as Observable<Judge[]>;
    this.roomsLoading$ = this.store.pipe(select(fromRooms.getLoading));
    this.judgesLoading$ = this.store.pipe(select(fromJudges.getJudgesLoading));
    this.sessionsLoading$ = this.store.pipe(select(fromSessionIndex.getSessionsLoading));
    this.problemsLoading$ = this.store.pipe(select(fromProblems.getProblemsLoading));
    this.sessionProblems$ = this.store.pipe(select(fromProblems.getProblemsWithReferences), map(this.asArray)) as Observable<ProblemViewmodel[]>;
    this.caseTypes = ['SCLAIMS', 'FTRACK', 'MTRACK'];
    this.durationInMinutes = 30;
    this.roomsLoading$.subscribe(isLoading => { this.roomsPlaceholder = isLoading ? 'Loading the rooms...' : 'Select the room'; });
    this.judgesLoading$.subscribe(isLoading => { this.judgesPlaceholder = isLoading ? 'Loading the judges...' : 'Select the judge'; });
    this.time = moment().format('HH:mm');

    this.session = {
        id: undefined,
        start: new Date(),
        duration: 0,
        roomId: null,
        personId: null,
        caseType: null,
    } as SessionCreate;
  }

    ngOnInit() {
        this.store.dispatch(new RoomActions.Get());
        this.store.dispatch(new JudgeActions.Get());
    }

    create() {
        this.session.id = uuid();
        let time_arr = this.time.split(':');
        this.session.start.setHours(time_arr[0]);
        this.session.start.setMinutes(time_arr[1]);
        this.session.duration = this.durationInMinutes.valueOf() * 60;
        this.store.dispatch(new SessionActions.Create(this.session));

        this.dialog.open(SessionsCreateDialogComponent, {
          width: 'auto',
          minWidth: 350,
          data: {
              sessionLoading: this.sessionsLoading$,
              problemsLoading$: this.problemsLoading$,
              problems$: this.sessionProblems$.pipe(map((data) => this.filterProblemsForSession(data, this.session.id)))
          } as SessionCreationSummary,
          hasBackdrop: true
        });
    }

    private asArray(data) {
        return Object.values(data) || [];
    }

    private filterProblemsForSession(problems: ProblemViewmodel[], sessionId: string | String) {
        return Object.values(problems).filter(problem => {
            return problem.references ? problem.references.find(ref => {
                return ref ? ref.entity_id === sessionId : false
            }) : false
        })
    }

}
