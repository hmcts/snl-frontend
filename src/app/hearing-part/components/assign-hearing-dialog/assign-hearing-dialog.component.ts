import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

export interface AssignHearingData {
    confirmed: boolean;
    startTime?: string;
}

@Component({
  selector: 'app-assign-hearing-dialog',
  templateUrl: './assign-hearing-dialog.component.html',
  styleUrls: ['./assign-hearing-dialog.component.scss']
})
export class AssignHearingDialogComponent implements OnInit {

  formGroup: FormGroup;
  startTime: string;

  constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.initiateForm();
  }

  onListHearing() {
    this.dialogRef.close({
        confirmed: true,
        startTime: this.startTime
    } as AssignHearingData);
  }

  onCancel() {
    this.dialogRef.close({
        confirmed: false
    } as AssignHearingData);
  }

  private initiateForm() {
      this.startTime = moment().format('HH:mm');

      this.formGroup = new FormGroup({
          startTime: new FormControl(this.startTime, [Validators.required]),
      });
  }
}
