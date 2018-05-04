import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { DiaryService } from '../services/diary.service';
import { DiaryActionTypes, Load, LoadComplete, LoadFailed } from '../actions/diary.actions';

@Injectable()
export class DiaryEffectEffects {

    @Effect()
    load$: Observable<Action> = this.actions$.pipe(
        ofType<Load>(DiaryActionTypes.DiaryLoadSessions),
        mergeMap(action =>
            this.diaryService.getDiarySessions(action.payload).pipe(
                // If successful, dispatch success action with result
                map(data => {
                    console.log('effects insides ');
                    console.log(data);
                    return (new LoadComplete(data))
                }),
                // If request fails, dispatch failed action
                catchError((err: HttpErrorResponse) => of(new LoadFailed('Error: ' + err.error)))
            )
        )
    );

    constructor(private diaryService: DiaryService, private actions$: Actions) {
    }

}
