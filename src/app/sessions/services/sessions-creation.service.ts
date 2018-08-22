import { Injectable } from '@angular/core';
import { SessionCreate } from '../models/session-create.model';
import * as SessionCreationActions from '../../features/transactions/actions/transaction.action';
import { EntityTransaction } from '../../features/transactions/models/transaction-status.model';
import * as SessionActions from '../actions/session.action';
import * as ProblemsActions from '../../problems/actions/problem.action';
import { Store } from '@ngrx/store';
import { State } from '../../app.state';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SessionsCreationService {
    constructor(private readonly store: Store<State>) {
    }

    create(session: SessionCreate) {
        const transactionId = uuid();

        session.userTransactionId = transactionId;
        const transaction = this.createTransaction(session.id, transactionId);

        this.store.dispatch(new SessionCreationActions.InitializeTransaction(transaction));
        this.store.dispatch(new SessionActions.Create(session));
        this.store.dispatch(new ProblemsActions.RemoveAll());
    }

    update(session: any) {
        const transactionId = uuid();

        session.userTransactionId = transactionId;
        const transaction = this.createTransaction(session.id, transactionId);

        this.store.dispatch(new SessionCreationActions.InitializeTransaction(transaction));
        this.store.dispatch(new SessionActions.Update(session));
        this.store.dispatch(new ProblemsActions.RemoveAll());
    }

    private createTransaction(sessionId, transactionId): EntityTransaction {
        return {
            entityId: sessionId,
            id: transactionId
        } as EntityTransaction;
    }
}
