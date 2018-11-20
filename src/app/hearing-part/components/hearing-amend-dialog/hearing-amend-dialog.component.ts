import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HearingViewmodelForAmendment } from '../../models/filtered-hearing-viewmodel';
import { Judge } from '../../../judges/models/judge.model';
import { CaseType } from '../../../core/reference/models/case-type';

export interface HearingAmendDialogData {
    judges: Judge[],
    caseTypes: CaseType[],
    hearingViewModel: HearingViewmodelForAmendment
}

@Component({
    selector: 'app-hearing-amend-dialog',
    templateUrl: './hearing-amend-dialog.component.html'
})
export class HearingAmendDialogComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: HearingAmendDialogData,
                private readonly dialogRef: MatDialogRef<HearingAmendDialogComponent>) {
    }

    onSave(updatedHearing: HearingViewmodelForAmendment) {
        this.dialogRef.close(updatedHearing);
    }
}
