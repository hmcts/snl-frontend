import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import { Create, CreateComplete, CreateFailed, Search, SearchComplete, SearchFailed, SessionActionTypes } from '../actions/session.action';
import { SessionsService } from '../services/sessions-service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class SessionEffects {
  @Effect()
  search$: Observable<Action> = this.actions$.pipe(
    ofType<Search>(SessionActionTypes.Search),
    mergeMap(action =>
      this.sessionsService.searchSessions(action.payload).pipe(
        map(data => (new SearchComplete(data))),
        catchError((err: HttpErrorResponse) => of(new SearchFailed(err.error)))
      )
    )
  );

  @Effect()
  create$: Observable<Action> = this.actions$.pipe(
      ofType<Create>(SessionActionTypes.Create),
      mergeMap(action =>
          this.sessionsService.createSession(action.payload).pipe(
              map(() => (new CreateComplete())),
              catchError((err: HttpErrorResponse) => of(new CreateFailed(err.error)))
          )
      )
  );

  constructor(private sessionsService: SessionsService, private actions$: Actions) {}
}
