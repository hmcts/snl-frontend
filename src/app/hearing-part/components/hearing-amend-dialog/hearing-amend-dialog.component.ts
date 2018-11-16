import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HearingViewmodelForAmendment } from '../../models/filtered-hearing-viewmodel';

@Component({
    selector: 'app-hearing-amend-dialog',
    templateUrl: './hearing-amend-dialog.component.html'
})
export class HearingAmendDialogComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: HearingViewmodelForAmendment,
                private readonly dialogRef: MatDialogRef<HearingAmendDialogComponent>) {
    }

    onSave(updatedHearing: HearingViewmodelForAmendment) {
        this.dialogRef.close(updatedHearing);
    }
}
