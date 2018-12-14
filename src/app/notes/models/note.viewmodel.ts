import { Note } from './note.model';

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
        createdAt: note.createdAt,
        modifiedBy: note.modifiedBy,
    }
}

export function sortNotesByLatestFirst(notes: NoteViewmodel[]) {
    return notes.sort((left, right) => {
        return right.createdAt.diff(left.createdAt);
    });
}

export const DEFAULT_NOTE_VIEW_MODEL: NoteViewmodel = {
    id: undefined,
    type: undefined,
    content: '',
    entityId: undefined,
    entityType: undefined,
    createdAt: undefined,
    modifiedBy: undefined,
    modified: false,
    inputLabel: undefined
}
