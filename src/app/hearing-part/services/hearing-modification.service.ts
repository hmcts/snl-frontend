import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromHearingParts from '../reducers';
import { HearingToSessionAssignment } from '../models/hearing-to-session-assignment';
import { AssignToSession, CreateListingRequest, Delete, UpdateListingRequest } from '../actions/hearing-part.action';
import { InitializeTransaction } from '../../features/transactions/actions/transaction.action';
import { EntityTransaction } from '../../features/transactions/models/transaction-status.model';
import * as ProblemsActions from '../../problems/actions/problem.action';
import { ListingCreate } from '../models/listing-create';
import { v4 as uuid } from 'uuid';
import { HearingPartDeletion } from '../models/hearing-part-deletion';
import * as fromHearingPartsActions from '../actions/hearing-part.action';
import * as fromHearings from '../actions/hearing.action';

@Injectable()
export class HearingModificationService {
    constructor(private readonly store: Store<fromHearingParts.State>) {
    }

    assignHearingWithSession(assignment: HearingToSessionAssignment) {
        this.store.dispatch(new AssignToSession(assignment));
        this.store.dispatch(new ProblemsActions.RemoveAll());
        this.store.dispatch(new InitializeTransaction(this.createTransaction(assignment.sessionId, assignment.userTransactionId)))
    }

    createListingRequest(listing: ListingCreate) {
        listing.hearing.userTransactionId = uuid();

        this.store.dispatch(new CreateListingRequest(listing.hearing));
        this.store.dispatch(new ProblemsActions.RemoveAll());
        this.store.dispatch(new InitializeTransaction(
                this.createTransaction(listing.hearing.id, listing.hearing.userTransactionId)
            )
        )
    }

    updateListingRequest(listing: ListingCreate) {
        listing.hearing.userTransactionId = uuid();

        this.store.dispatch(new UpdateListingRequest(listing));
        this.store.dispatch(new ProblemsActions.RemoveAll());
        this.store.dispatch(new InitializeTransaction(
                this.createTransaction(listing.hearing.id, listing.hearing.userTransactionId)
            )
        )
    }

    deleteHearingPart(hearingPartDeletion: HearingPartDeletion) {
        hearingPartDeletion.userTransactionId = uuid();

        this.store.dispatch(new ProblemsActions.RemoveAll());
        this.store.dispatch(new Delete(hearingPartDeletion));
        this.store.dispatch(new InitializeTransaction(this.createTransaction(hearingPartDeletion.hearingId,
            hearingPartDeletion.userTransactionId)))
    }

    removeFromState(id: string) {
        this.store.dispatch(new fromHearings.DeleteComplete(id));
    }

    private createTransaction(id, transactionId): EntityTransaction {
        return {
            entityId: id,
            id: transactionId
        } as EntityTransaction;
    }
}
