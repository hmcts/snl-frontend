import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap, retryWhen, concatMap, tap, withLatestFrom, distinctUntilChanged } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action, Store } from '@ngrx/store';
import * as sessionActions from '../actions/session.action';
import * as sessionTransactionActions from '../actions/session-transaction.action';
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
import { TransactionBackendService } from '../../core/services/transaction-backend.service';

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
                mergeMap((data) => [new sessionTransactionActions.CreateAcknowledged(data)]),
                catchError((err: HttpErrorResponse) => of(new sessionActions.CreateFailed(err.error)))
            )
        )
    );

    @Effect()
    checkIfCreated: Observable<Action> = this.actions$.pipe(
        ofType<sessionTransactionActions.CreateAcknowledged>(sessionTransactionActions.SessionTransactionActionTypes.CreateAcknowledged),
        mergeMap(action =>
            this.transactionService.getUserTransaction(action.payload).pipe(
                map(data => {
                    if ((data.rulesProcessingStatus !== 'COMPLETE') && (data.status !== 'STARTED')) {
                        throw 'no data';
                    }
                    return data.id;
                }),
                retryWhen(errors => errors.mergeMap(() => Observable.timer(5000))),
                concatMap((data) => [new sessionTransactionActions.GetProblemsForSession(data),
                    new sessionTransactionActions.CreateComplete(data)]),
            )
        ),
        catchError((err: HttpErrorResponse) => of(new sessionActions.CreateFailed(err.error)))
    );

    @Effect()
    getProblemsForCreatedSession: Observable<Action> = this.actions$.pipe(
        ofType<sessionTransactionActions.GetProblemsForSession>(sessionTransactionActions.SessionTransactionActionTypes.GetProblemsForSession),
        mergeMap(action =>
            this.problemsService.getForTransaction(action.payload).pipe(
                mergeMap((data) => [new problemActions.UpsertMany(data.entities.problems),
                    new sessionTransactionActions.ProblemsLoaded(action.payload)]),
            )
        ),
        catchError((err: HttpErrorResponse) => of(new sessionActions.CreateFailed(err.error)))
    );

    @Effect()
    rollbackTransaction: Observable<Action> = this.actions$.pipe(
        ofType<sessionTransactionActions.RollbackTransaction>(sessionTransactionActions.SessionTransactionActionTypes.RollbackTransaction),
        mergeMap(action =>
            this.transactionService.rollbackTransaction(action.payload).pipe(
                mergeMap((data) => [new sessionTransactionActions.TransactionRolledBack(data.id)]),
            )
        ),
        catchError((err: HttpErrorResponse) => of(new sessionActions.CreateFailed(err.error)))
    );

    @Effect()
    getSessionAfterCommit: Observable<Action> = this.actions$.pipe(
        ofType<sessionTransactionActions.TransactionCommitted>(sessionTransactionActions.SessionTransactionActionTypes.TransactionCommitted),
        withLatestFrom(this.store, (action, state) => state.sessions.sessionTransaction.entities[action.payload].sessionId),
        distinctUntilChanged(),
        mergeMap(action => this.sessionsService.getSession(action).pipe(
            mergeMap((data => [new sessionActions.UpsertOne(data.entities.sessions[action])])),
        )),
        catchError((err: HttpErrorResponse) => of(new sessionActions.CreateFailed(err.error)))
    );

    @Effect()
    commitTransaction: Observable<Action> = this.actions$.pipe(
        ofType<sessionTransactionActions.CommitTransaction>(sessionTransactionActions.SessionTransactionActionTypes.CommitTransaction),
        mergeMap(action =>
            this.transactionService.commitTransaction(action.payload).pipe(
                mergeMap((data) => [new sessionTransactionActions.TransactionCommitted(data.id)]),
            )
        ),
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

    constructor(private sessionsService: SessionsService,
                private transactionService: TransactionBackendService,
                private problemsService: ProblemsService,
                private store: Store<fromSessionIndex.State>,
                private actions$: Actions) {
    }
}
