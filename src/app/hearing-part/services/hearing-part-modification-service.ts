import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromHearingParts from '../reducers';
import { SessionAssignment } from '../models/session-assignment';
import { AssignToSession, CreateListingRequest, Delete, DeleteComplete, UpdateListingRequest } from '../actions/hearing-part.action';
import { InitializeTransaction } from '../../features/transactions/actions/transaction.action';
import { EntityTransaction } from '../../features/transactions/models/transaction-status.model';
import * as ProblemsActions from '../../problems/actions/problem.action';
import { ListingCreate } from '../models/listing-create';
import { v4 as uuid } from 'uuid';
import { HearingPartDeletion } from '../models/hearing-part-deletion';

@Injectable()
export class HearingPartModificationService {
    constructor(private readonly store: Store<fromHearingParts.State>) {
    }

    assignHearingPartWithSession(assignment: SessionAssignment) {
        this.store.dispatch(new AssignToSession(assignment));
        this.store.dispatch(new ProblemsActions.RemoveAll());
        this.store.dispatch(new InitializeTransaction(this.createTransaction(assignment.sessionId, assignment.userTransactionId)))
    }

    createListingRequest(listing: ListingCreate) {
        listing.hearingPart.userTransactionId = uuid();

        this.store.dispatch(new CreateListingRequest(listing.hearingPart));
        this.store.dispatch(new ProblemsActions.RemoveAll());
        this.store.dispatch(new InitializeTransaction(
                this.createTransaction(listing.hearingPart.id, listing.hearingPart.userTransactionId)
            )
        )
    }

    updateListingRequest(listing: ListingCreate) {
        listing.hearingPart.userTransactionId = uuid();

        this.store.dispatch(new UpdateListingRequest(listing));
        this.store.dispatch(new ProblemsActions.RemoveAll());
        this.store.dispatch(new InitializeTransaction(
                this.createTransaction(listing.hearingPart.id, listing.hearingPart.userTransactionId)
            )
        )
    }

    deleteHearingPart(hearingPartDeletion: HearingPartDeletion) {
        hearingPartDeletion.userTransactionId = uuid();

        this.store.dispatch(new ProblemsActions.RemoveAll());
        this.store.dispatch(new Delete(hearingPartDeletion));
        this.store.dispatch(new InitializeTransaction(this.createTransaction(hearingPartDeletion.hearingPartId,
            hearingPartDeletion.userTransactionId)))
    }

    removeFromState(id: string) {
        this.store.dispatch(new DeleteComplete(id))
    }

    private createTransaction(id, transactionId): EntityTransaction {
        return {
            entityId: id,
            id: transactionId
        } as EntityTransaction;
    }
}
