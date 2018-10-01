import { Note } from './note.model';

export interface NoteViewmodel extends Note {
    modified: boolean,
    inputLabel: string,
    readonly: boolean,
    displayCreationDetails: boolean
}

export function getNoteViewModel(note: Note): NoteViewmodel {
    return {
        id: note.id,
        content: note.content,
        type: note.type,
        modified: false,
        readonly: false,
        entityId: note.entityId,
        entityType: note.entityType,
        inputLabel: note.type,
        createdAt: note.createdAt,
        modifiedBy: note.modifiedBy,
        displayCreationDetails: false
    } as NoteViewmodel
}
