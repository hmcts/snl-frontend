import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, concatMap, filter, map, mergeMap, retryWhen } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import * as transactionActions from '../actions/transaction.action';
import * as problemActions from '../../../problems/actions/problem.action';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/mergeMap';
import { ProblemsService } from '../../../problems/services/problems.service';
import { TransactionBackendService, TransactionStatuses } from '../services/transaction-backend.service';

@Injectable()
export class TransactionEffects {

    @Effect()
    ifTransactionConflicted$: Observable<Action> = this.actions$.pipe(
        ofType<transactionActions.UpdateTransaction>(transactionActions.EntityTransactionActionTypes.UpdateTransaction),
        filter((t: any) => t.payload.status === TransactionStatuses.CONFLICT ||
            t.payload.status === TransactionStatuses.OPTIMISTIC_LOCK_CONFLICT),
        mergeMap(action => [new transactionActions.TransactionConflicted(action.payload.id)])
    );

    @Effect()
    ifTransactionStarted$: Observable<Action> = this.actions$.pipe(
        ofType<transactionActions.UpdateTransaction>(transactionActions.EntityTransactionActionTypes.UpdateTransaction),
        filter((t: any) => t.payload.status === TransactionStatuses.STARTED),
        concatMap(action => [new transactionActions.GetProblemsForTransaction(action.payload.id),
            new transactionActions.TransactionComplete(action.payload.id)])
    );

    @Effect()
    ifTransactionNotStartedOrConflict$: Observable<Action> = this.actions$.pipe(
        ofType<transactionActions.UpdateTransaction>(transactionActions.EntityTransactionActionTypes.UpdateTransaction),
        filter((t: any) => t.payload.status !== TransactionStatuses.STARTED &&
            t.payload.status !== TransactionStatuses.CONFLICT &&
            t.payload.status !== TransactionStatuses.OPTIMISTIC_LOCK_CONFLICT),
        mergeMap(action => [new transactionActions.GetTransactionUntilStartedOrConflict(action.payload)])
    );

    @Effect()
    checkIfCreated: Observable<Action> = this.actions$.pipe(
        ofType<transactionActions.GetTransactionUntilStartedOrConflict>(
            transactionActions.EntityTransactionActionTypes.GetTransactionUntilStartedOrConflict),
        mergeMap(action =>
            this.transactionService.getUserTransaction(action.payload.id).pipe(
                map(transcation => {
                    console.log(transcation);
                    if (transcation !== null &&
                        transcation.status !== TransactionStatuses.STARTED &&
                        transcation.status !== TransactionStatuses.OPTIMISTIC_LOCK_CONFLICT &&
                        transcation.status !== TransactionStatuses.CONFLICT) {
                        throw new Error('Transaction not started...');
                    } else {
                        return transcation;
                    }
                }),
                retryWhen(errors => errors.mergeMap(() => Observable.timer(5000))),
                concatMap((data) => [new transactionActions.UpdateTransaction(data)]),
            )
        ),
        catchError((err: HttpErrorResponse) => of(new transactionActions.TransactionFailure(err.error)))
    );

    @Effect()
    getProblemsForTransaction$: Observable<Action> = this.actions$.pipe(
        ofType<transactionActions.GetProblemsForTransaction>(
            transactionActions.EntityTransactionActionTypes.GetProblemsForTransaction),
        mergeMap(action =>
            this.problemsService.getForTransaction(action.payload).pipe(
                mergeMap((data) => [new problemActions.UpsertMany(data.entities.problems),
                    new transactionActions.ProblemsLoaded(action.payload)]),
            )
        ),
        catchError((err: HttpErrorResponse) => of(new transactionActions.TransactionFailure(err.error)))
    );

    @Effect()
    rollbackTransaction: Observable<Action> = this.actions$.pipe(
        ofType<transactionActions.RollbackTransaction>(transactionActions.EntityTransactionActionTypes.RollbackTransaction),
        mergeMap(action =>
            this.transactionService.rollbackTransaction(action.payload).pipe(
                mergeMap((data) => [new transactionActions.TransactionRolledBack(data.id)]),
            )
        ),
        catchError((err: HttpErrorResponse) => of(new transactionActions.TransactionFailure(err.error)))
    );

    @Effect()
    commitTransaction: Observable<Action> = this.actions$.pipe(
        ofType<transactionActions.CommitTransaction>(transactionActions.EntityTransactionActionTypes.CommitTransaction),
        mergeMap(action =>
            this.transactionService.commitTransaction(action.payload).pipe(
                mergeMap((data) => [new transactionActions.TransactionCommitted(data.id)]),
            )
        ),
        catchError((err: HttpErrorResponse) => of(new transactionActions.TransactionFailure(err.error)))
    );

    constructor(private readonly transactionService: TransactionBackendService,
                private readonly problemsService: ProblemsService,
                private readonly actions$: Actions) {
    }
}
