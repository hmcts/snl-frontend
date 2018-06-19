import { Injectable } from '@angular/core';
import { SessionCreate } from '../models/session-create.model';
import * as SessionCreationActions from '../actions/session-transaction.action';
import { SessionTransaction } from '../models/session-transaction-status.model';
import * as SessionActions from '../actions/session.action';
import { Store } from '@ngrx/store';
import { State } from '../../app.state';
import { v4 as uuid } from 'uuid';
import { Session } from '../models/session.model';
import { InitializeTransaction } from '../actions/session-transaction.action';

@Injectable()
export class SessionsCreationService {
    constructor(private store: Store<State>) {
    }

    create(session: SessionCreate) {
        let transactionId = uuid();
        let transaction = {
            entityId: session.id,
            id: transactionId
        } as SessionTransaction;

        session.userTransactionId = transactionId;

        this.store.dispatch(new SessionCreationActions.InitializeTransaction(transaction));
        this.store.dispatch(new SessionActions.Create(session));
    }

    update(session: any) {
        let transactionId = uuid();
        let transaction = {
            entityId: session.id,
            id: transactionId
        } as SessionTransaction;

        session.userTransactionId = transactionId;

        this.store.dispatch(new SessionCreationActions.InitializeTransaction(transaction));
        this.store.dispatch(new SessionActions.Update(session));
    }

    retrieveSessionFromEvent(event: any): Session {
        return {
            id: event.id,
            start: event.start,
            duration: event.duration,
            room: event.room,

        } as Session;
    }
}
