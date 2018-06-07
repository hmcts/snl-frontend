import { Injectable } from '@angular/core';
import { SessionCreate } from '../models/session-create.model';
import * as SessionCreationActions from '../actions/session-transaction.action';
import { SessionTransaction } from '../models/session-transaction-status.model';
import * as SessionActions from '../actions/session.action';
import { Store } from '@ngrx/store';
import { State } from '../../app.state';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SessionsCreationService {
    constructor(private store: Store<State>) {
    }

    create(session: SessionCreate) {
        let transactionId = uuid();
        let transaction = {
            sessionId: session.id,
            id: transactionId
        } as SessionTransaction;

        session.userTransactionId = transactionId;

        this.store.dispatch(new SessionCreationActions.Create(transaction));
        this.store.dispatch(new SessionActions.Create(session));
    }
}
