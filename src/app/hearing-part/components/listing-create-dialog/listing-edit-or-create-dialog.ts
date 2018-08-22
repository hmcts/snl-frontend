import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ListingCreate } from '../../models/listing-create';

@Component({
    selector: 'app-listing-edit-or-create-dialog',
    templateUrl: './listing-edit-or-create-dialog.html'
})
export class ListingEditOrCreateDialogComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: ListingCreate) {
    }

}
