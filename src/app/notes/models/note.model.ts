import { NoteViewmodel } from './note.viewmodel';

export interface Note {
  id: string;
  type: string;
  content: string;
}

export class NoteModel implements Note {
    id: string;
    type: string;
    content: string;

    public static fromNote(n: Note) {
        return new NoteModel(n.id, n.type, n.content);
    }

    constructor(id: string, type: string, content: string) {
        this.id = id;
        this.type = type;
        this.content = content;
    }
}

export function getNoteFromViewModel(note: NoteViewmodel): Note {
    return {
        id: note.id,
        content: note.content,
        type: note.type,
    } as Note
}