import { DialogPosition, MatDialogRef } from '@angular/material';
import { HostListener } from '@angular/core';

export class DraggableDialog {

    private offset = {x: 0, y: 0};
    private dialogId: string;

    constructor(public dialogRef: MatDialogRef<any>) {
        this.dialogId = this.dialogRef.id;
    }

    onCloseClick() {
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
