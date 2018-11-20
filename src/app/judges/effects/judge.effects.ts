import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Get, GetComplete, GetFailed, JudgeActionTypes } from '../actions/judge.action';
import { JudgeService } from '../services/judge.service';

@Injectable()
export class JudgeEffects {
    @Effect()
    search$: Observable<Action> = this.actions$.pipe(
        ofType<Get>(JudgeActionTypes.Get),
        mergeMap(action =>
            this.judgeService.fetch().pipe(
                map(data => (new GetComplete(data))),
                catchError((err: HttpErrorResponse) => of(new GetFailed(err.error)))
            )
        )
    );

    constructor(private readonly judgeService: JudgeService, private readonly actions$: Actions) {}
}
