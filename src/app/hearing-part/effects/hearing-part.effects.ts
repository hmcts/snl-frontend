import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import {
    AssignToSession,
    GetById,
    HearingPartActionTypes,
    Search,
    SearchFailed, UpsertMany, UpsertOne
} from '../actions/hearing-part.action';
import * as fromHearings from '../actions/hearing.action';
import { HttpErrorResponse } from '@angular/common/http';
import { HearingPartService } from '../services/hearing-part-service';
import * as transactionActions from '../../features/transactions/actions/transaction.action';
import * as sessionActions from '../../sessions/actions/session.action';
import * as notificationActions from '../../features/notification/actions/notification.action';
import { HEARING_PART_DIALOGS } from '../models/hearing-part-dialog-contents';
import * as sessionTransactionActs from '../../features/transactions/actions/transaction.action';
import * as notesActions from '../../notes/actions/notes.action';
import { Transaction } from '../../features/transactions/services/transaction-backend.service';

@Injectable()
export class HearingPartEffects {

    @Effect()
    assign$: Observable<Action> = this.actions$.pipe(
        ofType<AssignToSession>(HearingPartActionTypes.AssignToSession),
        mergeMap(action =>
            this.hearingPartService.assignToSession(action.payload).pipe(
                mergeMap(data => [new sessionTransactionActs.UpdateTransaction(data)]),
                catchError((err) => of(new transactionActions.TransactionFailure(
                    {err: err, id: action.payload.userTransactionId})))
            )
        )
    );

    @Effect()
    getById$: Observable<Action> = this.actions$.pipe(
        ofType<GetById>(HearingPartActionTypes.GetById),
        mergeMap(action =>
            this.hearingPartService.getById(action.payload).pipe(
                mergeMap(data => [new UpsertOne(data.entities.hearingParts[action.payload])]),
                catchError((err) => of(new notificationActions.OpenDialog(HEARING_PART_DIALOGS[err.status])))
            )
        )
    );

    @Effect()
    searchHearing$: Observable<Action> = this.actions$.pipe(
        ofType<Search>(HearingPartActionTypes.Search),
        mergeMap(action =>
          this.hearingPartService.searchHearingParts(action.payload).pipe(mergeMap(data => [
            new fromHearings.UpsertMany(data.entities.hearings),
            new UpsertMany(data.entities.hearingParts),
            new sessionActions.UpsertMany(data.entities.sessions),
            new notesActions.GetByEntities(Object.keys(data.entities.hearingParts))
        ]), catchError((err: HttpErrorResponse) => of(new SearchFailed(err.error))))
        )
    );

    @Effect()
    deleteHearing$: Observable<Action> = this.actions$.pipe(
      ofType<any>(HearingPartActionTypes.Delete),
      mergeMap(action =>
        this.hearingPartService.deleteHearingPart(action.payload).pipe(
          mergeMap((transaction: Transaction) => [new transactionActions.UpdateTransaction(transaction)]),
          catchError((err: HttpErrorResponse) => of(new transactionActions.TransactionFailure(
              {err: err, id: action.payload.userTransactionId}))))
        )
    );

    constructor(private readonly hearingPartService: HearingPartService, private readonly actions$: Actions) {
    }
}
