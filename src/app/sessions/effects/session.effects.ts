import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, distinctUntilChanged, mergeMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action, Store } from '@ngrx/store';
import * as sessionActions from '../actions/session.action';
import * as notificationActions from '../../features/notification/actions/notification.action';
import * as transactionActions from '../../features/transactions/actions/transaction.action';
import * as roomActions from '../../rooms/actions/room.action';
import * as judgeActions from '../../judges/actions/judge.action';
import * as hearingPartsActions from '../../hearing-part/actions/hearing-part.action';
import { SessionsService } from '../services/sessions-service';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/mergeMap';
import { CoreNotification } from '../../features/notification/model/core-notification';
import { State } from '../../app.state';
import * as fromSessionIndex from '../reducers/index';
import * as notesActions from '../../notes/actions/notes.action';

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
                    new judgeActions.UpsertMany(data.entities.persons),
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
                mergeMap((data) => [new transactionActions.UpdateTransaction(data)]),
                catchError((err: HttpErrorResponse) => of(new sessionActions.CreateFailed(err.error)))
            )
        )
    );

    @Effect()
    amend$: Observable<Action> = this.actions$.pipe(
        ofType<sessionActions.Amend>(sessionActions.SessionActionTypes.Amend),
        mergeMap(action =>
            this.sessionsService.amendSession(action.payload).pipe(
                mergeMap((data) => [new transactionActions.UpdateTransaction(data)]),
                catchError((err: HttpErrorResponse) => of(new transactionActions.TransactionFailure(
                    {err: err, id: action.payload.userTransactionId})))
            )
        )
    );

    @Effect()
    update$: Observable<Action> = this.actions$.pipe(
        ofType<sessionActions.Update>(sessionActions.SessionActionTypes.Update),
        distinctUntilChanged(),
        withLatestFrom(this.store, (action, state: fromSessionIndex.State) => {
            return {
                ...action, payload: {
                    ...action.payload,
                    version: state.sessions.sessions.entities[action.payload.id].version
                }
            }
        }),
        mergeMap(action =>
            this.sessionsService.updateSession(action.payload, action.payload.version).pipe(
                mergeMap((data) => [
                    new transactionActions.UpdateTransaction(data),
                    new sessionActions.UpdateComplete()
                ]),
                catchError((err) => of(new transactionActions.TransactionFailure(
                    {err: err, id: action.payload.userTransactionId})))
            )
        )
    );

    @Effect()
    getSession: Observable<Action> = this.actions$.pipe(
        ofType<sessionActions.Get>(sessionActions.SessionActionTypes.Get),
        mergeMap(action => this.sessionsService.getSession(action.payload).pipe(
            mergeMap((data => [new sessionActions.UpsertOne(data.entities.sessions[action.payload]),
                new notesActions.GetByEntities(Object.keys(data.entities.sessions))])),
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
                    new judgeActions.UpsertMany(data.entities.persons),
                    new hearingPartsActions.UpsertMany(data.entities.hearingParts),
                    new notesActions.GetByEntities(Object.keys(data.entities.sessions))
                ]),
                catchError((err: HttpErrorResponse) => of(new sessionActions.SearchFailed(err))
                )
            )
        )
    );

    @Effect()
    load$: Observable<Action> = this.actions$.pipe(
        ofType<sessionActions.SearchForJudge>(sessionActions.SessionActionTypes.SearchForJudge),
        mergeMap(action =>
            this.sessionsService.searchSessionsForJudge(action.payload).pipe(
                // If successful, dispatch success action with result
                mergeMap(data => [
                    new sessionActions.SearchComplete(data.entities.sessions),
                    new roomActions.GetComplete(data.entities.rooms),
                    new judgeActions.UpsertMany(data.entities.persons)
                ]),
                // If request fails, dispatch failed action
                catchError((err: HttpErrorResponse) => of(new sessionActions.SearchFailed('Error: ' + err.error)))
            )
        )
    );

    @Effect()
    loadSessionsWithHearings$: Observable<Action> = this.actions$.pipe(
        ofType<sessionActions.SearchForJudgeWithHearings>(sessionActions.SessionActionTypes.SearchForJudgeWithHearings),
        mergeMap(action =>
            this.sessionsService.searchSessionsForJudgeWithHearings(action.payload).pipe(
                // If successful, dispatch success action with result
                mergeMap(data => [
                    new sessionActions.SearchComplete(data.entities.sessions),
                    new roomActions.GetComplete(data.entities.rooms),
                    new judgeActions.UpsertMany(data.entities.persons),
                    new hearingPartsActions.SearchComplete(data.entities.hearingParts),
                    new notesActions.GetByEntities([...Object.keys(data.entities.sessions),
                        ...Object.keys(data.entities.hearingParts)])
                ]),
                // If request fails, dispatch failed action
                catchError((err: HttpErrorResponse) => of(new sessionActions.SearchFailed('Error: ' + err.error)))
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

    constructor(private readonly sessionsService: SessionsService,
                private readonly store: Store<State>,
                private readonly actions$: Actions) {
    }
}
