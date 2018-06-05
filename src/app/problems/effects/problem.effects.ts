import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, concatMap, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { ProblemsService } from '../services/problems.service';
import { Get, GetComplete, GetFailed, GetForSession, ProblemActionTypes, UpsertMany } from '../actions/problem.action';

@Injectable()
export class ProblemEffects {
    @Effect()
    search$: Observable<Action> = this.actions$.pipe(
        ofType<Get>(ProblemActionTypes.Get),
        mergeMap(action =>
            this.problemsService.get().pipe(
                map(data => (new GetComplete(data.entities.problems))),
                catchError((err: HttpErrorResponse) => of(new GetFailed(err.error)))
            )
        )
    );

    @Effect()
    searchForSession$: Observable<Action> = this.actions$.pipe(
        ofType<GetForSession>(ProblemActionTypes.GetForSession),
        mergeMap(action =>
            this.problemsService.getForTransaction(action.payload).pipe(
                switchMap(data => [
                    new UpsertMany(data.entities.problems)]),
                catchError((err: HttpErrorResponse) => of(new GetFailed(err.error)))
            )
        )
    );

    constructor(private problemsService: ProblemsService, private actions$: Actions) {}
}
