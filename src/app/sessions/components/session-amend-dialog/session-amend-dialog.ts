import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SessionAmmendDialogData } from '../../models/ammend/session-amend-dialog-data.model';

@Component({
    selector: 'app-session-amend-dialog',
    templateUrl: './session-amend-dialog.html'
})
export class SessionAmendDialogComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: SessionAmmendDialogData,
                private readonly dialogRef: MatDialogRef<SessionAmendDialogComponent>) {
    }

    onSaveOrCancel() {
        this.dialogRef.close();
    }
}
