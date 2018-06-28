import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DialogCreateSessionData } from '../../models/dialog-create-session-data';

@Component({
    selector: 'app-session-edit-or-create-dialog',
    templateUrl: './session-edit-or-create-dialog.component.html'
})
export class SessionEditOrCreateDialogComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogCreateSessionData) {
    }

}
