import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-dialog-info',
    templateUrl: './dialog-info.component.html',
    styleUrls: []
})
export class DialogInfoComponent {

    constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: string) {
    }

    onCloseClick() {
        this.dialogRef.close();
    }

}
