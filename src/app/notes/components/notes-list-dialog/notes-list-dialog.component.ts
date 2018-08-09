import { Component, Inject } from '@angular/core';
import { DraggableDialog } from '../../../core/dialog/draggable-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-notes-list-dialog',
    templateUrl: './notes-list-dialog.component.html',
    styleUrls: []
})
export class NotesListDialogComponent extends DraggableDialog {

    constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: string) {
        super(dialogRef);
    }
}
