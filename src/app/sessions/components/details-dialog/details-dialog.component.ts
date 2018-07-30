import { Component, HostListener, Inject } from '@angular/core';
import { DialogPosition, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SessionDialogDetails } from '../../models/session-dialog-details.model';

@Component({
  selector: 'app-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.scss']
})
export class DetailsDialogComponent {

  public sessionData;
  public time;
  public allocatedHearingsDuration;
  public availableDuration;

  constructor(
      public dialogRef: MatDialogRef<DetailsDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: SessionDialogDetails) {
      data.session.subscribe(s => this.sessionData = s);
      data.availableDuration.subscribe(ad => this.availableDuration = ad);
      data.allocatedHearingsDuration.subscribe(ahd => this.allocatedHearingsDuration = ahd);
      data.time.subscribe(t => this.time = t);
  }

    onCloseClick(): void {
        this.dialogRef.close();
    }

    @HostListener('drag', ['$event'])
    @HostListener('dragend', ['$event'])
    drag(e: DragEvent) {
        this.dialogRef.updatePosition({left: `${e.x}px`, top: `${e.y}px`} as DialogPosition)
    }
}
