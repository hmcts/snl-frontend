import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import {
    AssignToSession,
    HearingPartActionTypes,
    Search,
    SearchComplete, SearchFailed
} from '../actions/hearing-part.action';
import { HttpErrorResponse } from '@angular/common/http';
import { HearingPartService } from '../services/hearing-part-service';
import * as sessionActions from '../../sessions/actions/session.action';
import * as notificationActions from '../../features/notification/actions/notification.action';
import { HEARING_PART_DIALOGS } from '../models/hearing-part-dialog-contents';
import * as sessionTransactionActs from '../../sessions/actions/transaction.action';

@Injectable()
export class HearingPartEffects {

    @Effect()
    assign$: Observable<Action> = this.actions$.pipe(
        ofType<AssignToSession>(HearingPartActionTypes.AssignToSession),
        mergeMap(action =>
            this.hearingPartService.assignToSession(action.payload).pipe(
                mergeMap(data => [new sessionTransactionActs.UpdateTransaction(data)]),
                catchError((err) => of(new notificationActions.OpenDialog(HEARING_PART_DIALOGS[err.status]))
            )
        )
    );

    @Effect()
    searchHearing$: Observable<Action> = this.actions$.pipe(
        ofType<Search>(HearingPartActionTypes.Search),
        mergeMap(() => this.hearingPartService.searchHearingParts().pipe(mergeMap(data => [
            new SearchComplete(data.entities.hearingParts),
            new sessionActions.UpsertMany(data.entities.sessions)
        ]), catchError((err: HttpErrorResponse) => of(new SearchFailed(err.error))))
        )
    );

    constructor(private readonly hearingPartService: HearingPartService, private readonly actions$: Actions) {
    }
}
