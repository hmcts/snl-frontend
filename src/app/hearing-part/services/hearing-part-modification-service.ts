import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromHearingParts from '../reducers';
import { SessionAssignment } from '../models/session-assignment';
import { AssignToSession } from '../actions/hearing-part.action';
import { InitializeTransaction } from '../../features/transactions/actions/transaction.action';
import { EntityTransaction } from '../../features/transactions/models/transaction-status.model';
import * as ProblemsActions from '../../problems/actions/problem.action';

@Injectable()
export class HearingPartModificationService {
    constructor(private readonly store: Store<fromHearingParts.State>) {
    }

    assignHearingPartWithSession(assignment: SessionAssignment) {
        this.store.dispatch(new AssignToSession(assignment));
        this.store.dispatch(new ProblemsActions.RemoveAll());
        this.store.dispatch(new InitializeTransaction(this.createTransaction(assignment.sessionId, assignment.userTransactionId)))
    }

    private createTransaction(id, transactionId): EntityTransaction {
        return {
            entityId: id,
            id: transactionId
        } as EntityTransaction;
    }
}
