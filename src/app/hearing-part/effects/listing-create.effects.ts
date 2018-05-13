import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import { Create, CreateComplete, CreateFailed, CreateListingRequest, HearingPartActionTypes } from '../actions/hearing-part.action';
import { HttpErrorResponse } from '@angular/common/http';
import { HearingPartService } from '../services/hearing-part-service';

@Injectable()
export class ListingCreateEffects {

    @Effect()
    create$: Observable<Action> = this.actions$.pipe(
        ofType<CreateListingRequest>(HearingPartActionTypes.CreateListingRequest),
        mergeMap(action =>
            this.hearingPartService.createListing(action.payload).pipe(
                map(data => (new CreateComplete())),
                catchError((err: HttpErrorResponse) => of(new CreateFailed(err.error)))
            )
        )
    );

    constructor(private hearingPartService: HearingPartService, private actions$: Actions) {
    }
}
