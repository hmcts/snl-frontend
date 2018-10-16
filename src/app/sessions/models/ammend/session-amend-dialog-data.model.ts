import { SessionType } from '../../../core/reference/models/session-type';
import { SessionAmendForm } from '../../../../../e2e/models/session-amend-form';
import { Note } from '../../../notes/models/note.model';

export interface SessionAmmendDialogData {
    sessionData: SessionAmendForm,
    sessionTypes: SessionType[],
    notes: Note[]
}
