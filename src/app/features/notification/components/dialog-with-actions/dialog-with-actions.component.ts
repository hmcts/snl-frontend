import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { State } from '../../../../app.state';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-home',
    templateUrl: './dialog-with-actions.component.html',
    styleUrls: []
})
export class DialogWithActionsComponent {

    constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, private store: Store<State>) {
    }

    onOkClick(): void {
        this.dispatchAndClose(this.data.okAction);
    }

    onDeclineClick(): void {
        this.dispatchAndClose(this.data.declineAction);
    }

    private dispatchAndClose(action) {
        this.store.dispatch(action);
        this.dialogRef.close();
    }

}
