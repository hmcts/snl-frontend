import { Component, Inject, OnInit } from '@angular/core';
import { DetailsDialogComponent } from '../details-dialog/details-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { SessionDialogDetails } from '../../models/session-dialog-details.model';
import * as fromJudges from '../../../judges/reducers';
import { Room } from '../../../rooms/models/room.model';
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as fromSessionIndex from '../../reducers';
import * as fromProblems from '../../../problems/reducers';
import { SessionsCreationService } from '../../services/sessions-creation.service';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { State } from '../../../app.state';
import { Observable } from 'rxjs/Observable';
import * as fromRooms from '../../../rooms/reducers/room.reducer';
import { Judge } from '../../../judges/models/judge.model';
import * as RoomActions from '../../../rooms/actions/room.action';
import { Problem } from '../../../problems/models/problem.model';
import { Dictionary } from '@ngrx/entity/src/models';
import { SessionTransaction } from '../../models/session-transaction-status.model';
import { SessionsCreateDialogComponent } from '../sessions-create-dialog/sessions-create-dialog.component';
import { SessionCreationSummary } from '../../models/session-creation-summary';
import { Session } from '../../models/session.model';
import { SessionCreate } from '../../models/session-create.model';

@Component({
    selector: 'app-session-edit-or-create-dialog',
    templateUrl: './session-edit-or-create-dialog.component.html'
})
export class SessionEditOrCreateDialogComponent implements OnInit {
    private rooms$: Observable<Room[]>;
    private judges$: Observable<Judge[]>;
    private roomsLoading$: Observable<boolean | false>;
    private judgesLoading$: Observable<boolean | false>;

    private problems$: Observable<Dictionary<Problem>>;
    private recentlyCreatedSessionId$: Observable<string>;
    private recenlyCreatedSessionProblems$: Observable<Problem[]>;
    private recenlyCreatedSessionStatus$: Observable<SessionTransaction>;

    constructor(private store: Store<State>,
                public dialog: MatDialog,
                public sessionCreationService: SessionsCreationService,
                public transactionDialogRef: MatDialogRef<SessionsCreateDialogComponent>,
                public thisDialogRef: MatDialogRef<SessionEditOrCreateDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public sessionDetails: SessionCreate
    ) {
        this.rooms$ = this.store.pipe(select(fromSessionIndex.getRooms), map(this.asArray)) as Observable<Room[]>;
        this.judges$ = this.store.pipe(select(fromJudges.getJudges), map(this.asArray)) as Observable<Judge[]>;
        this.roomsLoading$ = this.store.pipe(select(fromRooms.getLoading));
        this.problems$ = this.store.pipe(select(fromProblems.getProblems));
        this.judgesLoading$ = this.store.pipe(select(fromJudges.getJudgesLoading));
        this.recentlyCreatedSessionId$ = this.store.pipe(select(fromSessionIndex.getRecentlyCreatedSessionId));
        this.recenlyCreatedSessionProblems$ = combineLatest(this.problems$, this.recentlyCreatedSessionId$,
            (problems, id) => {return this.filterProblemsForSession(problems, id); });
        this.recenlyCreatedSessionStatus$ = this.store.pipe(select(fromSessionIndex.getRecentlyCreatedSessionStatus));
    }

    ngOnInit() {
        this.store.dispatch(new RoomActions.Get());
        this.store.dispatch(new JudgeActions.Get());
    }

    cancel(event) {
        this.thisDialogRef.close();
        this.transactionDialogRef.close();
        console.log('cancel clicked', event);
    }

    create(session) {
        this.sessionCreationService.create(session);
        this.transactionDialogRef = this.openTransactionDialog(session);
    }

    private openTransactionDialog(session) {
        this.thisDialogRef.close();
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
                return ref ? ref.entity_id === sessionId : false;
            }) : false;
        });
    }
}
