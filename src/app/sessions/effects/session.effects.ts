import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import { Search, SearchComplete, SearchFailed, SessionActionTypes } from '../actions/session.action';
import { SessionsService } from '../services/sessions-service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class SessionEffects {
  @Effect()
  search$: Observable<Action> = this.actions$.pipe(
    ofType<Search>(SessionActionTypes.Search),
    mergeMap(action =>
      this.sessionsService.searchSessions(action.payload).pipe(
        // If successful, dispatch success action with result
        map(data => (new SearchComplete(data))),
        // If request fails, dispatch failed action
        catchError((err: HttpErrorResponse) => of(new SearchFailed('Error: ' + err.error)))
      )
    )
  );

  constructor(private sessionsService: SessionsService, private actions$: Actions) {}
}
