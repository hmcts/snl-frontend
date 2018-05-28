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
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as RoomActions from '../../../rooms/actions/room.action';
import * as fromSessionIndex from '../../reducers/index';
import { SessionsCreateDialogComponent } from '../../components/sessions-create-dialog/sessions-create-dialog.component';
import { MatDialog } from '@angular/material';
import { SessionCreationSummary } from '../../models/session-creation-summary';
import { map, tap } from 'rxjs/operators';
import { ProblemViewmodel } from '../../../problems/models/problem.viewmodel';

@Component({
  selector: 'app-sessions-create',
  templateUrl: './sessions-create.component.html',
  styleUrls: ['./sessions-create.component.scss']
})
export class SessionsCreateComponent implements OnInit {
    judges$: Observable<Judge[]>;
    rooms$: Observable<Room[]>;
    problems$: Observable<ProblemViewmodel[]>;
    sessionsLoading$: Observable<boolean>;
    problemsLoading$: Observable<boolean>;
    judgesLoading$: Observable<boolean>;
    roomsLoading$: Observable<boolean>;

    constructor(private store: Store<State>, public dialog: MatDialog) {
        this.rooms$ = this.store.pipe(select(fromSessionIndex.getRooms), map(this.asArray)) as Observable<Room[]>;
        this.judges$ = this.store.pipe(select(fromJudges.getJudges), map(this.asArray)) as Observable<Judge[]>;
        this.problems$ = this.store.pipe(select(fromProblems.getProblemsWithReferences), map(this.asArray)) as Observable<ProblemViewmodel[]>;
        this.roomsLoading$ = this.store.pipe(select(fromRooms.getLoading));
        this.judgesLoading$ = this.store.pipe(select(fromJudges.getJudgesLoading));
        this.sessionsLoading$ = this.store.pipe(select(fromSessionIndex.getSessionsLoading));
        this.problemsLoading$ = this.store.pipe(select(fromProblems.getProblemsLoading));
    }

    ngOnInit() {
        this.store.dispatch(new RoomActions.Get());
        this.store.dispatch(new JudgeActions.Get());
    }

    create(session) {
        this.store.dispatch(new SessionActions.Create(session));

        this.openDialog(session);
    }

    private openDialog(session) {
        this.dialog.open(SessionsCreateDialogComponent, {
            width: 'auto',
            minWidth: 350,
            data: {
                sessionLoading: this.sessionsLoading$,
                problemsLoading$: this.problemsLoading$,
                problems$: this.problems$.pipe(map((data) => this.filterProblemsForSession(data, session.id)))
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
