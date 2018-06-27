import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { State } from '../../../../app.state';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-dialog-actions',
    templateUrl: './dialog-with-actions.component.html',
    styleUrls: []
})
export class DialogWithActionsComponent {

    constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any) {
        data.okData = data.okData || true;
        data.declineData = data.declineData || false;
        data.showDecline = data.showDecline || true;
    }

    onOkClick(): void {
        this.closeWith(this.data.okData);
    }

    onDeclineClick(): void {
        this.closeWith(this.data.declineData);
    }

    private closeWith(data) {
        this.dialogRef.close(data);
    }

}
