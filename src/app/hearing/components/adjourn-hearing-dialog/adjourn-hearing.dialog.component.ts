import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogWithActionsComponent } from '../../../features/notification/components/dialog-with-actions/dialog-with-actions.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-dialog-actions',
    templateUrl: './adjourn-hearing.dialog.component.html',
    styleUrls: ['./adjourn-hearing.dialog.scss']
})
export class AdjournHearingDialogComponent extends DialogWithActionsComponent {
    description: string;
    adjournmentReasonFormGroup: FormGroup;

    constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef, data);
        this.initiateFormGroup();
    }

    onOkClick(): void {
        this.data.description = this.description;
        super.onOkClick();
    }

    private initiateFormGroup() {
        this.adjournmentReasonFormGroup = new FormGroup({
            description: new FormControl(this.description, [Validators.required, Validators.maxLength(500)])
        })
    }
}
