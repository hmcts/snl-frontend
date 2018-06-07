import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as SessionActions from '../../actions/session.action';
import * as SessionCreationActions from '../../actions/session-transaction.action';
import { Judge } from '../../../judges/models/judge.model';
import { Room } from '../../../rooms/models/room.model';
import { State } from '../../../app.state';
import { Observable } from 'rxjs/Observable';
import * as fromRooms from '../../../rooms/reducers/room.reducer';
import * as fromJudges from '../../../judges/reducers/index';
import * as fromProblems from '../../../problems/reducers/index';
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as RoomActions from '../../../rooms/actions/room.action';
import * as fromSessionIndex from '../../reducers/index';
import { SessionsCreateDialogComponent } from '../../components/sessions-create-dialog/sessions-create-dialog.component';
import { MatDialog } from '@angular/material';
import { SessionCreationSummary } from '../../models/session-creation-summary';
import { map, switchMap, tap } from 'rxjs/operators';
import { Problem } from '../../../problems/models/problem.model';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Dictionary } from '@ngrx/entity/src/models';
import { SessionTransaction } from '../../models/session-creation-status.model';

@Component({
  selector: 'app-sessions-create',
  templateUrl: './sessions-create.component.html',
  styleUrls: ['./sessions-create.component.scss']
})
export class SessionsCreateComponent implements OnInit {
    judges$: Observable<Judge[]>;
    rooms$: Observable<Room[]>;
    problems$: Observable<Dictionary<Problem>>;
    recenlyCreatedSessionProblems$: Observable<Problem[]>;
    recenlyCreatedSessionStatus$: Observable<SessionTransaction>;
    judgesLoading$: Observable<boolean>;
    roomsLoading$: Observable<boolean>;
    recentlyCreatedSessionId$: Observable<string>;
    dialogRef: any;

    constructor(private store: Store<State>, public dialog: MatDialog) {
        this.rooms$ = this.store.pipe(select(fromSessionIndex.getRooms), map(this.asArray)) as Observable<Room[]>;
        this.judges$ = this.store.pipe(select(fromJudges.getJudges), map(this.asArray)) as Observable<Judge[]>;
        this.roomsLoading$ = this.store.pipe(select(fromRooms.getLoading));
        this.problems$ = this.store.pipe(select(fromProblems.getProblems));
        this.judgesLoading$ = this.store.pipe(select(fromJudges.getJudgesLoading));
        this.recentlyCreatedSessionId$ = this.store.pipe(select(fromSessionIndex.getRecentlyCreatedSessionId));
        this.recenlyCreatedSessionProblems$ = combineLatest(this.problems$, this.recentlyCreatedSessionId$,
            (problems, id) => {return this.filterProblemsForSession(problems, id)});
        this.recenlyCreatedSessionStatus$ = this.store.pipe(select(fromSessionIndex.getRecentlyCreatedSessionStatus))
    }

    ngOnInit() {
        this.store.dispatch(new RoomActions.Get());
        this.store.dispatch(new JudgeActions.Get());
    }

    create(session) {
        let transaction = {
            sessionId: session.id,
            id: session.userTransactionId
        } as SessionTransaction;
        this.store.dispatch(new SessionCreationActions.Create(transaction));
        this.store.dispatch(new SessionActions.Create(session));
        this.dialogRef = this.openDialog(session);
    }

    private openDialog(session) {
        return this.dialog.open(SessionsCreateDialogComponent, {
            width: 'auto',
            minWidth: 350,
            data: {
                createdSessionStatus$: this.recenlyCreatedSessionStatus$,
                problems$: this.recenlyCreatedSessionProblems$
            } as SessionCreationSummary,
            hasBackdrop: true
        });
    }

    private asArray(data) {
        return Object.values(data) || [];
    }

    private filterProblemsForSession(problems: Dictionary<Problem>, sessionId: string | String) {
        return Object.values(problems).filter(problem => {
            return problem.references ? problem.references.find(ref => {
                return ref ? ref.entity_id === sessionId : false
            }) : false
        })
    }

}
