import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap, retryWhen, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import * as sessionActions from '../actions/session.action';
import * as sessionCreationActions from '../actions/session-creation.action';
import * as roomActions from '../../rooms/actions/room.action';
import * as problemActions from '../../problems/actions/problem.action';
import * as judgeActions from '../../judges/actions/judge.action';
import * as hearingPartsActions from '../../hearing-part/actions/hearing-part.action';
import { SessionsService } from '../services/sessions-service';
import { HttpErrorResponse } from '@angular/common/http';
import { SearchFailed, SessionActionTypes } from '../actions/session.action';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/mergeMap';
import { GetProblemsForSession } from '../actions/session-creation.action';
import { ProblemsService } from '../../problems/services/problems.service';

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
                mergeMap((data) => [new sessionCreationActions.CreateAcknowledged(data)]),
                catchError((err: HttpErrorResponse) => of(new sessionActions.CreateFailed(err.error)))
            )
        )
    );

    @Effect()
    checkIfCreated: Observable<Action> = this.actions$.pipe(
        ofType<sessionCreationActions.CreateAcknowledged>(sessionCreationActions.SessionCreationActionTypes.CreateAcknowledged),
        mergeMap(action =>
            this.sessionsService.getSession(action.payload).pipe(
                map(data => {
                    if (!data.entities.sessions) {
                        throw 'no data';
                    }
                    return data;
                }),
                retryWhen(errors => errors.mergeMap(error => Observable.timer(5000))),
                mergeMap((data) => [new sessionCreationActions.GetProblemsForSession(action.payload),
                    new sessionCreationActions.CreateComplete(action.payload),
                    new sessionActions.UpsertOne(data)]),
            )
        ),
        catchError((err: HttpErrorResponse) => of(new sessionActions.CreateFailed(err.error)))
    );

    @Effect()
    getProblemsForCreatedSession: Observable<Action> = this.actions$.pipe(
        ofType<sessionCreationActions.GetProblemsForSession>(sessionCreationActions.SessionCreationActionTypes.GetProblemsForSession),
        mergeMap(action =>
            this.problemsService.getForEntity(action.payload).pipe(
                mergeMap((data) => [new problemActions.UpsertMany(data.entities.problems),
                    new sessionCreationActions.ProblemsLoaded(action.payload)]),
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

    constructor(private sessionsService: SessionsService, private problemsService: ProblemsService, private actions$: Actions) {
    }
}
