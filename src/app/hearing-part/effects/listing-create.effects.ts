import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, concatMap, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import { CreateFailed, CreateListingRequest, HearingPartActionTypes, UpsertOne } from '../actions/hearing-part.action';
import { HttpErrorResponse } from '@angular/common/http';
import { HearingPartService } from '../services/hearing-part-service';
import { LISTING_REQUEST_CREATED } from '../models/hearing-part-notifications';
import * as fromNotifications  from '../../features/notification/actions/notification.action';
import * as fromNotes from '../../notes/actions/notes.action';

@Injectable()
export class ListingCreateEffects {

    @Effect()
    create$: Observable<Action> = this.actions$.pipe(
        ofType<CreateListingRequest>(HearingPartActionTypes.CreateListingRequest),
        mergeMap(action =>
            this.hearingPartService.createListing(action.payload.hearingPart).pipe(
                concatMap(() => [
                    new fromNotes.CreateMany(action.payload.notes),
                    new UpsertOne(action.payload.hearingPart),
                    new fromNotifications.Notify(LISTING_REQUEST_CREATED)]),
                catchError((err: HttpErrorResponse) => of(new CreateFailed(err.error)))
            )
        )
    );

    constructor(private readonly hearingPartService: HearingPartService, private readonly actions$: Actions) {
    }
}
