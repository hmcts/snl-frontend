import { NoteViewmodel } from './note.viewmodel';

export interface Note {
  id: string;
  type: string;
  content: string;
  parentId: string;
}

export function getNoteFromViewModel(note: NoteViewmodel): Note {
    return {
        id: note.id,
        content: note.content,
        type: note.type,
        parentId: note.parentId
    } as Note
}
