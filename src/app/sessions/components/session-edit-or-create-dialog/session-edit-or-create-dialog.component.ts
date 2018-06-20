import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SessionCreate } from '../../models/session-create.model';
import { SessionEditData } from '../../models/session-edit-data';

@Component({
    selector: 'app-session-edit-or-create-dialog',
    templateUrl: './session-edit-or-create-dialog.component.html'
})
export class SessionEditOrCreateDialogComponent {

    sessionEditData: SessionEditData;

    constructor(public thisDialogRef: MatDialogRef<SessionEditOrCreateDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public sessionDetails: SessionCreate
    ) {
        this.sessionEditData = {
            editedSession: this.sessionDetails,
            onCancel: this.cancel,
            dialogReference: this.thisDialogRef
        } as SessionEditData;
    }

    cancel(event) {
        event.details.dialogReference.close();
        console.log('cancel clicked', event);
    }
}
