import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap, retryWhen, concatMap, withLatestFrom, distinctUntilChanged, filter } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action, Store } from '@ngrx/store';
import * as sessionActions from '../actions/session.action';
import * as notificationActions from '../../features/notification/actions/notification.action';
import * as sessionTransactionActs from '../actions/transaction.action';
import * as roomActions from '../../rooms/actions/room.action';
import * as problemActions from '../../problems/actions/problem.action';
import * as fromSessionIndex from '../reducers/index';
import * as judgeActions from '../../judges/actions/judge.action';
import * as hearingPartsActions from '../../hearing-part/actions/hearing-part.action';
import { SessionsService } from '../services/sessions-service';
import { HttpErrorResponse } from '@angular/common/http';
import { SearchFailed, SessionActionTypes } from '../actions/session.action';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/mergeMap';
import { ProblemsService } from '../../problems/services/problems.service';
import {
    TransactionBackendService,
    TransactionStatuses
} from '../../core/services/transaction-backend.service';
import { CoreNotification } from '../../features/notification/model/core-notification';

@Injectable()
export class SessionEffects {

    @Effect()
    search$: Observable<Action> = this.actions$.pipe(
        ofType<sessionActions.Search>(sessionActions.SessionActionTypes.Search),
        mergeMap(action =>
            this.sessionsService.searchSessions(action.payload).pipe(
                mergeMap(data => [
                    new sessionActions.SearchComplete(data.entities.sessions),
                    new roomActions.UpsertMany(data.entities.rooms),
                    new judgeActions.GetComplete(data.entities.persons),
                ]),
                catchError((err: HttpErrorResponse) => of(new sessionActions.SearchFailed(err.error)))
            )
        )
    );

    @Effect()
    create$: Observable<Action> = this.actions$.pipe(
        ofType<sessionActions.Create>(sessionActions.SessionActionTypes.Create),
        mergeMap(action =>
            this.sessionsService.createSession(action.payload).pipe(
                mergeMap((data) => [new sessionTransactionActs.UpdateTransaction(data)]),
                catchError((err: HttpErrorResponse) => of(new sessionActions.CreateFailed(err.error)))
            )
        )
    );

    @Effect()
    update$: Observable<Action> = this.actions$.pipe(
        ofType<sessionActions.Update>(sessionActions.SessionActionTypes.Update),
        mergeMap(action =>
            this.sessionsService.updateSession(action.payload).pipe(
                mergeMap((data) => [new sessionTransactionActs.UpdateTransaction(data)]),
                catchError((err) => of(new sessionActions.CreateFailed(err.error)))
            )
        )
    );

    @Effect()
    ifTransactionConflicted$: Observable<Action> = this.actions$.pipe(
        ofType<sessionTransactionActs.UpdateTransaction>(sessionTransactionActs.EntityTransactionActionTypes.UpdateTransaction),
        filter((t: any) => t.payload.status === TransactionStatuses.CONFLICT),
        mergeMap(action => [new sessionTransactionActs.TransactionConflicted(action.payload.id)])
    );

    @Effect()
    ifTransactionStarted$: Observable<Action> = this.actions$.pipe(
        ofType<sessionTransactionActs.UpdateTransaction>(sessionTransactionActs.EntityTransactionActionTypes.UpdateTransaction),
        filter((t: any) => t.payload.status === TransactionStatuses.STARTED),
        concatMap(action => [new sessionTransactionActs.GetProblemsForTransaction(action.payload.id),
            new sessionTransactionActs.TransactionComplete(action.payload.id)])
    );

    @Effect()
    ifTransactionNotStartedOrConflict$: Observable<Action> = this.actions$.pipe(
        ofType<sessionTransactionActs.UpdateTransaction>(sessionTransactionActs.EntityTransactionActionTypes.UpdateTransaction),
        filter((t: any) => t.payload.status !== TransactionStatuses.STARTED && t.payload.status !== TransactionStatuses.CONFLICT),
        mergeMap(action => [new sessionTransactionActs.GetTransactionUntilStartedOrConflict(action.payload)])

    );

    @Effect()
    checkIfCreated: Observable<Action> = this.actions$.pipe(
        ofType<sessionTransactionActs.GetTransactionUntilStartedOrConflict>(
            sessionTransactionActs.EntityTransactionActionTypes.GetTransactionUntilStartedOrConflict),
        mergeMap(action =>
            this.transactionService.getUserTransaction(action.payload.id).pipe(
                map(transcation => {
                    if (transcation.status !== TransactionStatuses.STARTED && transcation.status !== TransactionStatuses.CONFLICT) {
                        throw 'Transaction not started...';
                    } else {
                        return transcation;
                    }
                }),
                retryWhen(errors => errors.mergeMap(() => Observable.timer(5000))),
                concatMap((data) => [new sessionTransactionActs.UpdateTransaction(data)]),
            )
        ),
        catchError((err: HttpErrorResponse) => of(new sessionActions.CreateFailed(err.error)))
    );

    @Effect()
    getProblemsForTransaction$: Observable<Action> = this.actions$.pipe(
        ofType<sessionTransactionActs.GetProblemsForTransaction>(
            sessionTransactionActs.EntityTransactionActionTypes.GetProblemsForTransaction),
        mergeMap(action =>
            this.problemsService.getForTransaction(action.payload).pipe(
                mergeMap((data) => [new problemActions.UpsertMany(data.entities.problems),
                    new sessionTransactionActs.ProblemsLoaded(action.payload)]),
            )
        ),
        catchError((err: HttpErrorResponse) => of(new sessionActions.CreateFailed(err.error)))
    );

    @Effect()
    rollbackTransaction: Observable<Action> = this.actions$.pipe(
        ofType<sessionTransactionActs.RollbackTransaction>(sessionTransactionActs.EntityTransactionActionTypes.RollbackTransaction),
        mergeMap(action =>
            this.transactionService.rollbackTransaction(action.payload).pipe(
                mergeMap((data) => [new sessionTransactionActs.TransactionRolledBack(data.id)]),
            )
        ),
        catchError((err: HttpErrorResponse) => of(new sessionActions.CreateFailed(err.error)))
    );

    @Effect()
    commitTransaction: Observable<Action> = this.actions$.pipe(
        ofType<sessionTransactionActs.CommitTransaction>(sessionTransactionActs.EntityTransactionActionTypes.CommitTransaction),
        mergeMap(action =>
            this.transactionService.commitTransaction(action.payload).pipe(
                mergeMap((data) => [new sessionTransactionActs.TransactionCommitted(data.id)]),
            )
        ),
        catchError((err: HttpErrorResponse) => of(new sessionActions.CreateFailed(err.error)))
    );

    @Effect()
    getSessionAfterCommit: Observable<Action> = this.actions$.pipe(
        ofType<sessionTransactionActs.TransactionCommitted>(sessionTransactionActs.EntityTransactionActionTypes.TransactionCommitted),
        withLatestFrom(this.store, (action, state) => state.sessions.sessionTransaction.entities[action.payload].entityId),
        mergeMap(action => this.sessionsService.getSession(action).pipe(
            mergeMap((data => [new sessionActions.UpsertOne(data.entities.sessions[action]), new hearingPartsActions.Search()])),
        )),
        catchError((err: HttpErrorResponse) => of(new sessionActions.CreateFailed(err.error)))
    );

    @Effect()
    searchForDates$: Observable<Action> = this.actions$.pipe(
        ofType<sessionActions.SearchForDates>(sessionActions.SessionActionTypes.SearchForDates),
        mergeMap(action =>
            this.sessionsService.searchSessionsForDates(action.payload).pipe(
                // If successful, dispatch success action with result
                mergeMap(data => [
                    new sessionActions.SearchComplete(data.entities.sessions),
                    new roomActions.UpsertMany(data.entities.rooms),
                    new judgeActions.GetComplete(data.entities.persons),
                    new hearingPartsActions.UpsertMany(data.entities.hearingParts)
                ]),
                catchError((err: HttpErrorResponse) => of(new sessionActions.SearchFailed(err))
            )
        )
        )
    );

    @Effect()
    load$: Observable<Action> = this.actions$.pipe(
        ofType<sessionActions.SearchForJudge>(SessionActionTypes.SearchForJudge),
        mergeMap(action =>
            this.sessionsService.searchSessionsForJudge(action.payload).pipe(
                // If successful, dispatch success action with result
                mergeMap(data => [
                    new sessionActions.SearchComplete(data.entities.sessions),
                    new roomActions.GetComplete(data.entities.rooms),
                    new judgeActions.GetComplete(data.entities.persons)
                ]),
                // If request fails, dispatch failed action
                catchError((err: HttpErrorResponse) => of(new SearchFailed('Error: ' + err.error)))
            )
        )
    );

    @Effect()
    loadSessionsWithHearings$: Observable<Action> = this.actions$.pipe(
        ofType<sessionActions.SearchForJudgeWithHearings>(SessionActionTypes.SearchForJudgeWithHearings),
        mergeMap(action =>
            this.sessionsService.searchSessionsForJudgeWithHearings(action.payload).pipe(
                // If successful, dispatch success action with result
                mergeMap(data => [
                    new sessionActions.SearchComplete(data.entities.sessions),
                    new roomActions.GetComplete(data.entities.rooms),
                    new judgeActions.GetComplete(data.entities.persons),
                    new hearingPartsActions.SearchComplete(data.entities.hearingParts)
                ]),
                // If request fails, dispatch failed action
                catchError((err: HttpErrorResponse) => of(new SearchFailed('Error: ' + err.error)))
            )
        )
    );

    @Effect()
    searchPropositions$: Observable<Action> = this.actions$.pipe(
        ofType<sessionActions.SearchPropositions>(sessionActions.SessionActionTypes.SearchPropositions),
        mergeMap(action =>
            this.sessionsService.searchSessionPropositions(action.payload).pipe(
                mergeMap(data => [
                    new sessionActions.AddPropositions(data),
                    new notificationActions.Notify({
                        message: 'Search propositions completed',
                        duration: 3000
                    } as CoreNotification)
                ]),
                catchError((err: HttpErrorResponse) => of(new sessionActions.SearchFailed(err.error)))
            )
        )
    );

    constructor(private sessionsService: SessionsService,
                private transactionService: TransactionBackendService,
                private problemsService: ProblemsService,
                private store: Store<fromSessionIndex.State>,
                private actions$: Actions) {
    }
}
