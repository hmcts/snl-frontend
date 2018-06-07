import { Component, HostListener, Inject, OnInit, AfterViewInit } from '@angular/core';
import { DialogPosition, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SessionDialogDetails } from '../../models/session-dialog-details.model';
import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable.js';

@Component({
  selector: 'app-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.scss']
})
export class DetailsDialogComponent implements AfterViewInit {

  constructor(
      public dialogRef: MatDialogRef<DetailsDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public sessionDetails: SessionDialogDetails) { }

    onCloseClick(): void {
        this.dialogRef.close();
    }

    ngAfterViewInit() {
        ($('.draggable-hearing') as any).draggable({
               revert: true
        });
    }

    @HostListener('drag', ['$event'])
    @HostListener('dragend', ['$event'])
    drag(e: DragEvent) {
        this.dialogRef.updatePosition({left: `${e.x}px`, top: `${e.y}px`} as DialogPosition)
    }
}
