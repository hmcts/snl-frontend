import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as RoomActions from '../../../rooms/actions/room.action';
import * as SessionActions from '../../actions/session.action';
import { State } from '../../../app.state';
import { select, Store } from '@ngrx/store';
import * as fromRooms from '../../../rooms/reducers';
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
import { MatDialog, MatDialogRef } from '@angular/material';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { SessionsCreationService } from '../../services/sessions-creation.service';
import { asArray } from '../../../utils/array-utils';

@Component({
    selector: 'app-sessions-propositions-search',
    templateUrl: './sessions-propositions-search.component.html',
    styleUrls: ['./sessions-propositions-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsPropositionsSearchComponent implements OnInit {

    filterData: SessionPropositionQuery;
    judges$: Observable<Judge[]>;
    rooms$: Observable<Room[]>;
    sessionPropositions$: Observable<SessionPropositionView[]>;
    judgesLoading$: Observable<boolean>;
    roomsLoading$: Observable<boolean>;
    filterDataLoading$: Observable<boolean | false>;
    sessionPropositionsLoading$: Observable<boolean | false>;
    private createSessionDialogRef: MatDialogRef<SessionEditOrCreateDialogComponent>;

    constructor(private readonly store: Store<State>,
                private readonly dialog: MatDialog,
                private readonly sessionCreationService: SessionsCreationService
    ) {
        this.rooms$ = this.store.pipe(select(fromSessionIndex.getRooms), map(asArray)) as Observable<Room[]>;
        this.judges$ = this.store.pipe(select(fromJudges.getJudges), map(asArray)) as Observable<Judge[]>;
        this.sessionPropositions$ = this.store.pipe(
            select(fromSessionIndex.getFullSessionPropositions), map(asArray)
        ) as Observable<SessionPropositionView[]>;
        this.sessionPropositionsLoading$ = this.store.pipe(select(fromSessionIndex.getSessionsPropositionLoading));
        this.roomsLoading$ = this.store.pipe(select(fromRooms.getRoomsLoading));
        this.judgesLoading$ = this.store.pipe(select(fromJudges.getJudgesLoading));
        this.filterDataLoading$ = combineLatest(
            this.roomsLoading$, this.judgesLoading$, (r, j) =>  r || j
        );
    }

    ngOnInit() {
        this.store.dispatch(new RoomActions.Get());
        this.store.dispatch(new JudgeActions.Get());
    }

    search(searchRequest: SessionPropositionQuery) {
        this.filterData = searchRequest;
        this.store.dispatch(new SessionActions.SearchPropositions(searchRequest));
    }

    onSessionCreate(spv: SessionPropositionView) {
        this.createSessionDialogRef = this.openSessionCreateDialog(spv)
    }

    closeSessionCreateDialog() {
        this.createSessionDialogRef.close();
    }

    dialogSessionCreateClicked(session: SessionCreate) {
        this.sessionCreationService.create(session);
        this.openTransactionDialog();
        this.closeSessionCreateDialog();
    }

    private openSessionCreateDialog(spv: SessionPropositionView) {
        let durationInSeconds = 0;
        if (this.filterData !== undefined) {
            durationInSeconds = this.filterData.durationInMinutes * 60;
        }

        return this.dialog.open(SessionEditOrCreateDialogComponent, {
            width: 'auto',
            minWidth: 350,
            data: {
                sessionData: {
                    userTransactionId: undefined,
                    id: undefined,
                    start: moment(spv.date, 'DD MMM YYYY').add(moment.duration(spv.startTime as string)),
                    duration: durationInSeconds,
                    roomId: spv.room.id,
                    personId: spv.judge.id,
                    caseType: undefined
                } as SessionCreate,
                rooms$: this.rooms$,
                judges$: this.judges$,
                onCreateSessionAction: session => this.dialogSessionCreateClicked(session),
                onCancelAction: () => this.closeSessionCreateDialog()
            },
            hasBackdrop: true
        });
    }

    private openTransactionDialog() {
        return this.dialog.open(TransactionDialogComponent, {
            width: 'auto',
            minWidth: 350,
            hasBackdrop: true
        });
    }

}
