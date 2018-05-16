import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import { Notify, NotificationActionTypes } from '../actions/notification.action';
import { MatSnackBar } from '@angular/material';
import * as sessionActions from '../../../sessions/actions/session.action';

@Injectable()
export class NotificationEffects {

    FOREVER = {duration: 1000000000};

    notificationHandle;

    @Effect({ dispatch: false })
    create$: Observable<Action> = this.actions$.pipe(
        ofType<Notify>(NotificationActionTypes.Create),
        tap(action => {
            this.createNotification(action);
        })
    );

    @Effect({ dispatch: false })
    dismiss$: Observable<Action> = this.actions$.pipe(
        ofType<Notify>(NotificationActionTypes.Dismiss),
        tap(action => {
            this.dismissNotification();
        })
    );

    constructor(private actions$: Actions, public snackBar: MatSnackBar) {
    }

    createNotification(action) {
        this.notificationHandle = this.snackBar.open(action.payload.message, null, {duration: action.payload.duration});
    }

    dismissNotification() {
        this.notificationHandle.dismiss();
    }
}
