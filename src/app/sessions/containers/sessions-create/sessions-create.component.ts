import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Judge } from '../../../judges/models/judge.model';
import { Room } from '../../../rooms/models/room.model';
import { State } from '../../../app.state';
import { Observable } from 'rxjs/Observable';
import * as fromRooms from '../../../rooms/reducers';
import * as fromJudges from '../../../judges/reducers';
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as RoomActions from '../../../rooms/actions/room.action';
import * as SessionActions from '../../actions/session.action';
import * as fromSessionIndex from '../../reducers';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { MatDialog } from '@angular/material';
import { map } from 'rxjs/operators';
import { SessionsCreationService } from '../../services/sessions-creation.service';
import { asArray } from '../../../utils/array-utils';
import * as refData from '../../../core/reference/reducers/index';
import { SessionType } from '../../../core/reference/models/session-type';
import { ITransactionDialogData } from '../../../features/transactions/models/transaction-dialog-data.model';
import * as fromNotes from '../../../notes/actions/notes.action';
import { DEFAULT_DIALOG_CONFIG } from '../../../features/transactions/models/default-dialog-confg';

@Component({
    selector: 'app-sessions-create',
    templateUrl: './sessions-create.component.html',
    styleUrls: ['./sessions-create.component.scss']
})
export class SessionsCreateComponent implements OnInit {

    judges$: Observable<Judge[]>;
    rooms$: Observable<Room[]>;
    judgesLoading$: Observable<boolean>;
    roomsLoading$: Observable<boolean>;
    sessionTypes$: Observable<SessionType[]>;
    dialogRef: any;
    sessionId: string;

    constructor(private readonly store: Store<State>,
                public dialog: MatDialog,
                public sessionCreationService: SessionsCreationService) {
        this.rooms$ = this.store.pipe(select(fromSessionIndex.getRooms), map(asArray)) as Observable<Room[]>;
        this.judges$ = this.store.pipe(select(fromJudges.getJudges), map(asArray)) as Observable<Judge[]>;
        this.roomsLoading$ = this.store.pipe(select(fromRooms.getRoomsLoading));
        this.judgesLoading$ = this.store.pipe(select(fromJudges.getJudgesLoading));
        this.sessionTypes$ = this.store.pipe(select(refData.selectSessionTypes));
    }

    ngOnInit() {
        this.store.dispatch(new RoomActions.Get());
        this.store.dispatch(new JudgeActions.Get());
    }

    create(sessionCreate) {
        this.sessionId = sessionCreate.session.id;
        this.sessionCreationService.create(sessionCreate.session);
        this.openDialog().afterClosed().subscribe((confirmed) => this.afterClosed(confirmed, sessionCreate.notes));
    }

    afterClosed(confirmed, notes) {
         if (confirmed) {
            this.store.dispatch(new SessionActions.Get(this.sessionId));
            this.store.dispatch(new fromNotes.CreateMany(notes));
        }
    }

    private openDialog() {
        return this.dialog.open<any, ITransactionDialogData>(TransactionDialogComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: { actionTitle: 'Creating session' }
        });
    }
}
