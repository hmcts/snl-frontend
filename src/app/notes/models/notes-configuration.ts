import { Note } from './note.model';

export interface NotesConfiguration {
    readonly entityName: string,
    readonly defaultNotes: () => Note[]
}
