import { Component, HostListener, Inject } from '@angular/core';
import { DialogPosition, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SessionDialogDetails } from '../../models/session-dialog-details.model';

@Component({
  selector: 'app-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.scss']
})
export class DetailsDialogComponent {

    private offset = {x: 0, y: 0};
    readonly dialogId: string;

    constructor(
      public dialogRef: MatDialogRef<DetailsDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public sessionDetails: SessionDialogDetails) {
      this.dialogId = this.dialogRef.id;
    }

    onCloseClick(): void {
        this.dialogRef.close();
    }

    @HostListener('dragend', ['$event'])
    drag(e: DragEvent) {
        this.dialogRef.updatePosition({left: `${e.x - this.offset.x}px`,
            top: `${e.y - this.offset.y}px`} as DialogPosition)
    }

    @HostListener('dragstart', ['$event'])
    onDragStart(e: DragEvent) {
      const dialog = document.querySelector(`#${this.dialogId}`);
      const top = dialog.getBoundingClientRect().top;
      const left = dialog.getBoundingClientRect().left;

      this.offset = {x: e.x - left, y: e.y - top};
      }
}
