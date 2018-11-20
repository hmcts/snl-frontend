import { Injectable } from '@angular/core';
import { catchError, mergeMap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import * as notificationActions from '../../../features/notification/actions/notification.action';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { ReferenceDataService } from '../services/reference-data.service';
import {
    GetAllCaseType,
    GetAllCaseTypeComplete,
    GetAllHearingType,
    GetAllHearingTypeComplete,
    GetAllRoomType,
    GetAllRoomTypeComplete,
    GetAllSessionType,
    GetAllSessionTypeComplete,
    ReferenceDataActionTypes
} from '../actions/reference-data.action';
import { REFERENCE_DATA_DIALOGS } from '../models/reference-data-dialog-contents';

@Injectable()
export class ReferenceDataEffects {

    @Effect()
    getCaseTypes$: Observable<Action> = this.actions$.pipe(
        ofType<GetAllCaseType>(ReferenceDataActionTypes.GetAllCaseType),
        mergeMap(action =>
            this.referenceDataService.fetchCaseTypes().pipe(
                mergeMap(data => [new GetAllCaseTypeComplete(data)]),
                catchError((err) => of(new notificationActions.OpenDialog(REFERENCE_DATA_DIALOGS[err.status])))
            )
        )
    );

    @Effect()
    getHearingTypes$: Observable<Action> = this.actions$.pipe(
        ofType<GetAllHearingType>(ReferenceDataActionTypes.GetAllHearingType),
        mergeMap(action =>
            this.referenceDataService.fetchHearingTypes().pipe(
                mergeMap(data => [new GetAllHearingTypeComplete(data)]),
                catchError((err) => of(new notificationActions.OpenDialog(REFERENCE_DATA_DIALOGS[err.status])))
            )
        )
    );

    @Effect()
    getRoomTypes$: Observable<Action> = this.actions$.pipe(
        ofType<GetAllRoomType>(ReferenceDataActionTypes.GetAllRoomType),
        mergeMap(action =>
            this.referenceDataService.fetchRoomTypes().pipe(
                mergeMap(data => [new GetAllRoomTypeComplete(data)]),
                catchError((err) => of(new notificationActions.OpenDialog(REFERENCE_DATA_DIALOGS[err.status])))
            )
        )
    );

    @Effect()
    getSessionTypes$: Observable<Action> = this.actions$.pipe(
        ofType<GetAllSessionType>(ReferenceDataActionTypes.GetAllSessionType),
        mergeMap(action =>
            this.referenceDataService.fetchSessionTypes().pipe(
                mergeMap(data => [new GetAllSessionTypeComplete(data)]),
                catchError((err) => of(new notificationActions.OpenDialog(REFERENCE_DATA_DIALOGS[err.status])))
            )
        )
    );

    constructor(private readonly referenceDataService: ReferenceDataService, private readonly actions$: Actions) {
    }
}
