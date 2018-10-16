import { SessionType } from '../../../core/reference/models/session-type';
import { Note } from '../../../notes/models/note.model';
import { SessionAmmendForm } from './session-ammend-form.model';

export interface SessionAmmendDialogData {
    sessionData: SessionAmmendForm,
    sessionTypes: SessionType[],
    notes: Note[]
}
