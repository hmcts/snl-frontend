import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromHearingParts from '../reducers';
import { HearingPartToSessionAssignment, HearingToSessionAssignment } from '../models/hearing-to-session-assignment';
import {
    AssignToSession,
    CreateListingRequest,
    Delete,
    UpdateListingRequest,
    DeleteByHearingId
} from '../actions/hearing-part.action';
import { InitializeTransaction } from '../../features/transactions/actions/transaction.action';
import { EntityTransaction } from '../../features/transactions/models/transaction-status.model';
import * as ProblemsActions from '../../problems/actions/problem.action';
import { ListingCreate } from '../models/listing-create';
import { v4 as uuid } from 'uuid';
import { HearingDeletion } from '../models/hearing-deletion';
import * as fromHearings from '../actions/hearing.action';

@Injectable()
export class HearingModificationService {
    constructor(private readonly store: Store<fromHearingParts.State>) {
    }

    assignWithSession(assignment: HearingToSessionAssignment | HearingPartToSessionAssignment) {
        this.store.dispatch(new AssignToSession(assignment));
        this.store.dispatch(new ProblemsActions.RemoveAll());
        this.store.dispatch(new InitializeTransaction(this.createTransaction(null, assignment.userTransactionId)))
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

    deleteHearing(hearingDeletion: HearingDeletion) {
        hearingDeletion.userTransactionId = uuid();

        this.store.dispatch(new ProblemsActions.RemoveAll());
        this.store.dispatch(new Delete(hearingDeletion));
        this.store.dispatch(new InitializeTransaction(this.createTransaction(hearingDeletion.hearingId,
            hearingDeletion.userTransactionId)))
    }

    removeFromState(id: string) {
        this.store.dispatch(new fromHearings.DeleteComplete(id));
        this.store.dispatch(new ProblemsActions.RemoveAll());
        this.store.dispatch(new DeleteByHearingId(id));
    }

    private createTransaction(id, transactionId): EntityTransaction {
        return {
            entityId: id,
            id: transactionId
        } as EntityTransaction;
    }
}
