import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AmendScheduledListingData } from '../../models/amend-scheduled-listing';
import { TimeFormatValidator } from '../../../core/validators/time-format.validator';

@Component({
    selector: 'app-amend-scheduled-listing',
    templateUrl: './amend-scheduled-listing.component.html',
    styleUrls: []
})
export class AmendScheduledListingComponent {
    amendFormGroup: FormGroup;

    constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public amendData: AmendScheduledListingData) {
        this.initiateFormGroup();
    }

    amend(): void {
        this.amendData.startTime = this.formatStartTime(this.amendData.startTime);
        this.dialogRef.close(this.amendData);
    }

    private initiateFormGroup() {
        this.amendFormGroup = new FormGroup({
            startTime: new FormControl(this.amendData.startTime, [Validators.required, TimeFormatValidator.validate]),
        });
    }

    private formatStartTime(startTimeAsString: string) {
        let startTime = moment(startTimeAsString, 'HH:mm');
        startTime = moment.utc(moment().hour(startTime.hour()).minutes(startTime.minute()));

        return startTime.format('HH:mm');
    }
}
