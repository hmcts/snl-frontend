import { SessionCreate } from './session-create.model';
import { SessionEditOrCreateDialogComponent } from '../components/session-edit-or-create-dialog/session-edit-or-create-dialog.component';
import { MatDialogRef } from '@angular/material';

export interface SessionEditData {
    onCancel: (any) => void;
    editedSession: SessionCreate;
    dialogReference: MatDialogRef<SessionEditOrCreateDialogComponent>;
}
