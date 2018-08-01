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
        parentId: note.parentId,
        entity: note.entity
    } as NoteViewmodel
}
