import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap, pairwise, switchMap, tap } from 'rxjs/operators';
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
import * as sessionActions from '../../sessions/actions/session.action';
import { UpsertMany } from '../../sessions/actions/session.action';
import { Notify } from '../../core/notification/actions/notification.action';
import { ASSIGN_HEARING_PART, HEARING_PART_ASSIGN_SUCCESS } from '../models/hearing-part-notifications';

@Injectable()
export class HearingPartEffects {

    @Effect()
    search$: Observable<Action> = this.actions$.pipe(
        ofType<AssignToSession>(HearingPartActionTypes.AssignToSession),
        mergeMap(action =>
            this.hearingPartService.assignToSession(action.payload).pipe(
                mergeMap(data => [new AssignComplete(data.entities.hearingParts), new Notify(HEARING_PART_ASSIGN_SUCCESS)]),
                catchError((err: HttpErrorResponse) => of(new AssignFailed(err.error)))
            )
        )
    );

    @Effect()
    search_hearing$: Observable<Action> = this.actions$.pipe(
        ofType<Search>(HearingPartActionTypes.Search),
        mergeMap(action =>
            this.hearingPartService.searchHearingParts().pipe(
                mergeMap(data => [
                    new SearchComplete(data.entities.hearingParts),
                    new sessionActions.UpsertMany(data.entities.sessions)
                ]),
                catchError((err: HttpErrorResponse) => of(new SearchFailed(err.error)))
            )
        )
    );

    constructor(private hearingPartService: HearingPartService, private actions$: Actions) {
    }
}
