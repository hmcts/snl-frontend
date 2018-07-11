import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { Notify, NotificationActionTypes, OpenDialog, OpenDialogWithAction } from '../actions/notification.action';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogWithActionsComponent } from '../components/dialog-with-actions/dialog-with-actions.component';
import { DialogInfoComponent } from '../components/dialog-info/dialog-info.component';

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

    @Effect({ dispatch: false })
    openDialog$: Observable<Action> = this.actions$.pipe(
        ofType<OpenDialog>(NotificationActionTypes.OpenDialog),
        tap((action: OpenDialog) => {
            this.openDialog(action.payload);
        })
    );

    @Effect({ dispatch: false })
    OpenDialogWithAction$: Observable<Action> = this.actions$.pipe(
        ofType<OpenDialogWithAction>(NotificationActionTypes.OpenDialogWithAction),
        tap((action: OpenDialogWithAction) => {
            this.openDialog(action.payload);
        })
    );

    constructor(private readonly actions$: Actions, public snackBar: MatSnackBar, public dialog: MatDialog) {
    }

    createNotification(action) {
        this.notificationHandle = this.snackBar.open(action.payload.message, null, {duration: action.payload.duration});
    }

    dismissNotification() {
        this.notificationHandle.dismiss();
    }

    openDialog(message) {
        return this.dialog.open(DialogInfoComponent, {
            width: 'auto',
            minWidth: 350,
            data: message,
            hasBackdrop: true
        });
    }

    openDialogWithActions(message) {
        return this.dialog.open(DialogWithActionsComponent, {
            width: 'auto',
            minWidth: 350,
            data: message,
            hasBackdrop: true
        });
    }
}
