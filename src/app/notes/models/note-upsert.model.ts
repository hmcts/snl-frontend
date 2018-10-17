import { NoteViewmodel } from './note.viewmodel';

export interface NoteUpsert {
  id: string;
  type: string;
  content: string;
  entityId: string;
  entityType: string;
}

export function getNoteUpsertFromNoteViewModel(note: NoteViewmodel): NoteUpsert {
    return {
        id: note.id,
        content: note.content,
        type: note.type,
        entityId: note.entityId,
        entityType: note.entityType,
    }
}
