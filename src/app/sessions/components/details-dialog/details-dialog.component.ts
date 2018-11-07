import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SessionDialogDetails } from '../../models/session-dialog-details.model';
import { DraggableDialog } from '../../../core/dialog/draggable-dialog';
import { HearingPartViewModel } from '../../../hearing-part/models/hearing-part.viewmodel';

@Component({
  selector: 'app-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.scss']
})
export class DetailsDialogComponent extends DraggableDialog {

    constructor(
      public dialogRef: MatDialogRef<DetailsDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public sessionDetails: SessionDialogDetails) {
        super(dialogRef);
    }

    displayInformativeLegend(hearingParts: HearingPartViewModel[]) {
        return hearingParts.find(hp => hp.multiSession);
    }
}
