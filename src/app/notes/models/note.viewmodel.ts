import { Note } from './note.model';

export interface NoteViewmodel extends Note {
    modified: boolean
}

export function getNoteViewModel(note: Note): NoteViewmodel {
    return {
        id: note.id,
        content: note.content,
        type: note.type,
        modified: false,
        entityId: note.entityId,
        entityType: note.entityType
    } as NoteViewmodel
}
