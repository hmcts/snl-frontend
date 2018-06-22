import { Component, HostListener, Inject } from '@angular/core';
import { DialogPosition, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SessionDialogDetails } from '../../models/session-dialog-details.model';


@Component({
  selector: 'app-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.scss']
})
export class DetailsDialogComponent{

  constructor(
      public dialogRef: MatDialogRef<DetailsDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public sessionDetails: SessionDialogDetails) { }

    onCloseClick(): void {
        this.dialogRef.close();
    }

    @HostListener('drag', ['$event'])
    @HostListener('dragend', ['$event'])
    drag(e: DragEvent) {
        this.dialogRef.updatePosition({left: `${e.x}px`, top: `${e.y}px`} as DialogPosition)
    }
}
