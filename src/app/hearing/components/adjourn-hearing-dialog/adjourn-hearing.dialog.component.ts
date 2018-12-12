import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogWithActionsComponent } from '../../../features/notification/components/dialog-with-actions/dialog-with-actions.component';

@Component({
    selector: 'app-dialog-actions',
    templateUrl: './adjourn-hearing.dialog.component.html',
    styleUrls: ['./adjourn-hearing.dialog.scss']
})
export class AdjournHearingDialogComponent extends DialogWithActionsComponent {
    description: string;

    constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef, data);
    }

    onOkClick(): void {
        this.data.description = this.description;
        super.onOkClick();
    }

    onDeclineClick(): void {
        super.onDeclineClick();
    }

    showDecline(): boolean {
        return (this.data['hideDecline'] === undefined) ? true : !this.data.hideDecline;
    }
}
