import { NoteViewmodel } from './note.viewmodel';

export interface Note {
  id: string;
  type: string;
  content: string;
  entityId: string;
  entityType: string;
  createdAt: string;
  modifiedBy: string;
}

export function getNoteFromViewModel(note: NoteViewmodel): Note {
    return {
        id: note.id,
        content: note.content,
        type: note.type,
        entityId: note.entityId,
        entityType: note.entityType,
        createdAt: note.createdAt,
        modifiedBy: note.modifiedBy
    } as Note
}
