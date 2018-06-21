import { Component, HostListener, Inject, OnInit, AfterViewChecked } from '@angular/core';
import { DialogPosition, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SessionDialogDetails } from '../../models/session-dialog-details.model';
import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable.js';

@Component({
  selector: 'app-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.scss']
})
export class DetailsDialogComponent implements AfterViewChecked {

  constructor(
      public dialogRef: MatDialogRef<DetailsDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public sessionDetails: SessionDialogDetails) { }

    onCloseClick(): void {
        this.dialogRef.close();
    }

    ngAfterViewChecked() {
        let draggables = ($('.draggable-hearing') as any);
        if (draggables !== null && draggables.length !== 0) {
            draggables.draggable({
                revert: false,
                //containment: 'window',
                //helper: 'clone'
                helper: function (event, ui) {
                    return $(this).clone().css("pointer-events", "none").appendTo(".container").show();
            });
        }
    }

    @HostListener('drag', ['$event'])
    @HostListener('dragend', ['$event'])
    drag(e: DragEvent) {
        this.dialogRef.updatePosition({left: `${e.x}px`, top: `${e.y}px`} as DialogPosition)
    }
}
