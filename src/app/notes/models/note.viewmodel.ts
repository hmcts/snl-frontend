import { Note } from './note.model';
import * as moment from 'moment';

export interface NoteViewmodel extends Note {
    modified: boolean,
    inputLabel: string,
}

export const DEFAULT_NOTE_DATE_FORMAT = 'DD/MM/YYYY hh:mm';

export function getNoteViewModel(note: Note): NoteViewmodel {
    return {
        id: note.id,
        content: note.content,
        type: note.type,
        modified: false,
        entityId: note.entityId,
        entityType: note.entityType,
        inputLabel: note.type,
        createdAt: moment(note.createdAt).format(DEFAULT_NOTE_DATE_FORMAT),
        modifiedBy: note.modifiedBy,
    }
}
