import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-dialog-actions',
    templateUrl: './dialog-with-actions.component.html',
    styleUrls: []
})
export class DialogWithActionsComponent {

    constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any) {
        dialogRef.disableClose = true;
    }

    onOkClick(): void {
        this.data.confirmed = true;
        this.closeWith(this.data);
    }

    onDeclineClick(): void {
        this.data.confirmed = false;
        this.closeWith(this.data);
    }

    showDecline(): boolean {
        return (this.data.hideDecline === undefined) ? true : !this.data.hideDecline;
    }

    private closeWith(data) {
        this.dialogRef.close(data);
    }

}
