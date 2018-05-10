import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import {
    AssignComplete,
    AssignFailed,
    AssignToSession,
    HearingPartActionTypes,
    Search,
    SearchComplete, SearchFailed
} from '../actions/hearing-part.action';
import { HttpErrorResponse } from '@angular/common/http';
import { HearingPartService } from '../services/hearing-part-service';

@Injectable()
export class HearingPartEffects {

    @Effect()
    search$: Observable<Action> = this.actions$.pipe(
        ofType<AssignToSession>(HearingPartActionTypes.AssignToSession),
        mergeMap(action =>
            this.hearingPartService.assignToSession(action.payload).pipe(
                map(data => (new AssignComplete(data))),
                catchError((err: HttpErrorResponse) => of(new AssignFailed(err.error)))
            )
        )
    );

    @Effect()
    search_hearing$: Observable<Action> = this.actions$.pipe(
        ofType<Search>(HearingPartActionTypes.Search),
        mergeMap(action =>
            this.hearingPartService.searchHearingParts().pipe(
                map(data => (new SearchComplete(data))),
                catchError((err: HttpErrorResponse) => of(new SearchFailed(err.error)))
            )
        )
    );

    constructor(private hearingPartService: HearingPartService, private actions$: Actions) {
    }
}
