import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import { CreateFailed, CreateListingRequest, HearingPartActionTypes, UpdateListingRequest } from '../actions/hearing-part.action';
import { HttpErrorResponse } from '@angular/common/http';
import { HearingPartService } from '../services/hearing-part-service';
import * as transactionActions from '../../features/transactions/actions/transaction.action';
import {
    Transaction
} from '../../features/transactions/services/transaction-backend.service';

@Injectable()
export class ListingCreateEffects {

    @Effect()
    create$: Observable<Action> = this.actions$.pipe(
        ofType<CreateListingRequest>(HearingPartActionTypes.CreateListingRequest),
        mergeMap(action =>
            this.hearingPartService.createListing(action.payload).pipe(
                mergeMap((transaction: Transaction) => [new transactionActions.UpdateTransaction(transaction)]),
                catchError((err: HttpErrorResponse) => of(new CreateFailed(err.error)))
            )
        )
    );

    @Effect()
    update$: Observable<Action> = this.actions$.pipe(
        ofType<UpdateListingRequest>(HearingPartActionTypes.UpdateListingRequest),
        mergeMap(action =>
            this.hearingPartService.updateListing(action.payload.hearingPart).pipe(
                mergeMap((transaction: Transaction) => [new transactionActions.UpdateTransaction(transaction)]),
                catchError((err: any) => of(new transactionActions.TransactionFailure(
                    {err: err, id: action.payload.hearingPart.userTransactionId}))
                )
            )
        )
    );

    constructor(private readonly hearingPartService: HearingPartService, private readonly actions$: Actions) {
    }
}
