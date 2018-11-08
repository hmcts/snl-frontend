import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ListingRequestViewmodel } from '../../models/listing-create';

@Component({
    selector: 'app-listing-update-dialog',
    templateUrl: './listing-update-dialog.html'
})
export class ListingUpdateDialogComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: ListingRequestViewmodel,
                private readonly dialogRef: MatDialogRef<ListingUpdateDialogComponent>) {
    }

    onSave(updatedListing: ListingRequestViewmodel) {
        this.dialogRef.close(updatedListing);
    }
}
