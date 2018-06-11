import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap, pairwise, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import {
    AssignComplete,
    AssignToSession,
    HearingPartActionTypes,
    Search,
    SearchComplete, SearchFailed
} from '../actions/hearing-part.action';
import { HttpErrorResponse } from '@angular/common/http';
import { HearingPartService } from '../services/hearing-part-service';
import * as sessionActions from '../../sessions/actions/session.action';
import * as notificationActions from '../../core/notification/actions/notification.action';
import { Notify } from '../../core/notification/actions/notification.action';
import { HEARING_PART_ASSIGN_SUCCESS } from '../models/hearing-part-notifications';
import { HEARING_PART_DIALOGS } from '../models/hearing-part-dialog-contents';

@Injectable()
export class HearingPartEffects {

    @Effect()
    assign$: Observable<Action> = this.actions$.pipe(
        ofType<AssignToSession>(HearingPartActionTypes.AssignToSession),
        mergeMap(action =>
            this.hearingPartService.assignToSession(action.payload).pipe(
                mergeMap(data => [new AssignComplete({id: action.payload.hearingPartId, session: action.payload.sessionId}),
                    new Notify(HEARING_PART_ASSIGN_SUCCESS)]),
                catchError((err) => of(new notificationActions.OpenDialog(HEARING_PART_DIALOGS[err])))
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
