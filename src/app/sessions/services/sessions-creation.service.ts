import { Injectable } from '@angular/core';
import { SessionCreate } from '../models/session-create.model';
import * as SessionCreationActions from '../../features/transactions/actions/transaction.action';
import { EntityTransaction } from '../../features/transactions/models/transaction-status.model';
import * as SessionActions from '../actions/session.action';
import * as ProblemsActions from '../../problems/actions/problem.action';
import { Store } from '@ngrx/store';
import { State } from '../../app.state';
import { v4 as uuid } from 'uuid';
import { SessionAmmend } from '../models/ammend/session-ammend.model';
import { DragAndDropSession } from '../models/drag-and-drop-session.model';

@Injectable()
export class SessionsCreationService {

    private recentSessionId;

    constructor(private readonly store: Store<State>) {
    }

    create(session: SessionCreate) {
        this.recentSessionId = session.id;

        const transactionId = uuid();

        session.userTransactionId = transactionId;
        const transaction = this.createTransaction(session.id, transactionId);

        this.store.dispatch(new SessionCreationActions.InitializeTransaction(transaction));
        this.store.dispatch(new SessionActions.Create(session));
        this.store.dispatch(new ProblemsActions.RemoveAll());
    }

    update(dragAndDropSession: DragAndDropSession) {
        this.recentSessionId = dragAndDropSession.sessionId;

        const transactionId = uuid();
        const transaction = this.createTransaction(dragAndDropSession.sessionId, transactionId);

        this.store.dispatch(new SessionCreationActions.InitializeTransaction(transaction));
        this.store.dispatch(new SessionActions.Update({...dragAndDropSession, userTransactionId: transactionId}));
        this.store.dispatch(new ProblemsActions.RemoveAll());
    }

    amend(sessionAmmend: SessionAmmend) {
        this.recentSessionId = sessionAmmend.id;

        const transactionId = uuid();

        sessionAmmend.userTransactionId = transactionId;
        const transaction = this.createTransaction(sessionAmmend.id, transactionId);

        this.store.dispatch(new SessionCreationActions.InitializeTransaction(transaction));
        this.store.dispatch(new SessionActions.Amend(sessionAmmend));
        this.store.dispatch(new ProblemsActions.RemoveAll());
    }

    fetchUpdatedEntities() {
        this.store.dispatch(new SessionActions.Get(this.recentSessionId));
    }

    private createTransaction(sessionId, transactionId): EntityTransaction {
        return {
            entityId: sessionId,
            id: transactionId
        } as EntityTransaction;
    }
}
