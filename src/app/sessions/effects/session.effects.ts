import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import * as sessionActions from '../actions/session.action';
import * as roomActions from '../../rooms/actions/room.action';
import * as judgeActions from '../../judges/actions/judge.action';
import { SessionsService } from '../services/sessions-service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class SessionEffects {

    @Effect()
    search$: Observable<Action> = this.actions$.pipe(
        ofType<sessionActions.Search>(sessionActions.SessionActionTypes.Search),
        mergeMap(action =>
            this.sessionsService.searchSessions(action.payload).pipe(
                mergeMap(data => [
                    new roomActions.GetComplete(data.entities.rooms),
                    new judgeActions.GetComplete(data.entities.persons),
                    new sessionActions.SearchComplete(data.entities.sessions)
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
                map(() => (new sessionActions.CreateComplete())),
                catchError((err: HttpErrorResponse) => of(new sessionActions.CreateFailed(err.error)))
            )
        )
    );

    @Effect()
    searchForDates$: Observable<Action> = this.actions$.pipe(
        ofType<sessionActions.SearchForDates>(sessionActions.SessionActionTypes.SearchForDates),
        mergeMap(action =>
            this.sessionsService.searchSessionsForDates(action.payload).pipe(
                // If successful, dispatch success action with result
                mergeMap(data => [
                    new roomActions.GetComplete(data.entities.rooms),
                    new judgeActions.GetComplete(data.entities.persons),
                    new sessionActions.SearchComplete(data.entities.sessions)
                ]),
                catchError((err: HttpErrorResponse) => of(new sessionActions.SearchFailed(err))
            )
        )
        )
    );

    constructor(private sessionsService: SessionsService, private actions$: Actions) {
    }
}
