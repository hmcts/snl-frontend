import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Get, GetComplete, GetFailed, RoomActionTypes } from '../actions/room.action';
import { RoomService } from '../services/room.service';

@Injectable()
export class RoomEffects {
    @Effect()
    search$: Observable<Action> = this.actions$.pipe(
        ofType<Get>(RoomActionTypes.Get),
        mergeMap(action =>
            this.roomService.get().pipe(
                map(data => (new GetComplete(data.entities.rooms))),
                catchError((err: HttpErrorResponse) => of(new GetFailed(err.error)))
            )
        )
    );

    constructor(private roomService: RoomService, private actions$: Actions) {}
}
