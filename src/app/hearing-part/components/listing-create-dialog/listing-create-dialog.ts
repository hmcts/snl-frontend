import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ListingCreate } from '../../models/listing-create';

@Component({
    selector: 'app-listing-create-dialog',
    templateUrl: './listing-create-dialog.html'
})
export class ListingCreateDialogComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: ListingCreate,
                private readonly dialogRef: MatDialogRef<ListingCreateDialogComponent>) {
    }

    onSave() {
        this.dialogRef.close();
    }

}
