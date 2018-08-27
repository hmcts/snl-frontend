import { Component, Inject } from '@angular/core';
import { DraggableDialog } from '../../../core/dialog/draggable-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HearingPartViewModel } from '../../models/hearing-part.viewmodel';

@Component({
  selector: 'app-delete-hearing-part-dialog',
  templateUrl: 'delete-hearing-part-dialog.component.html'
})
export class DeleteHearingPartDialogComponent extends DraggableDialog {

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public hearingPart: HearingPartViewModel) {
    super(dialogRef);
  }

  onYesClick() {
    this.dialogRef.close(true);
  }

  onCloseClick() {
    this.dialogRef.close(false);
  }
}
