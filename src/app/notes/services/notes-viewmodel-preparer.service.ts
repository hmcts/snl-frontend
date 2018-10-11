import { NotesConfiguration } from './../models/notes-configuration';
import { NoteViewmodel } from './../models/note.viewmodel';
import { Note } from '../models/note.model';
import { getNoteViewModel } from '../models/note.viewmodel';

export class NotesViewModelPreparerService {
    notesConfig: NotesConfiguration
    constructor() { }

    public prepare(notes: Note[]): NoteViewmodel[] {
        const tmpNotes = this.setNotesIfExist(notes);
        return tmpNotes.map(getNoteViewModel)
          .map(this.disableShowingCreationDetailsOnNewNotes)
          .map(this.makeExistingFreetextNotesReadonly)
    }

    private setNotesIfExist(notes: Note[]) {
        let defaultNotes = this.notesConfig.defaultNotes().map(defaultNote => {
            const alreadyExistingNote = notes.find(note => note.type === defaultNote.type);
            if (alreadyExistingNote !== undefined) {
                notes = notes.filter(n => n.id !== alreadyExistingNote.id);
            }

            return alreadyExistingNote || defaultNote
        });

        let combinedNotes = [...defaultNotes, ...notes];

        if (this.containsOldFreeTextNote(combinedNotes)) {
            return [this.notesConfig.getNewFreeTextNote(), ...combinedNotes];
        } else {
            return combinedNotes;
        }
    }

    private containsOldFreeTextNote(notes: Note[]) {
        return notes.find(n => n.type === 'Other note' && n.id === undefined) === undefined;
    }

    private disableShowingCreationDetailsOnNewNotes(note: NoteViewmodel): NoteViewmodel {
        if (note.id === undefined) {
            note.displayCreationDetails = false;
        }
        return note;
    }

    private makeExistingFreetextNotesReadonly(n: NoteViewmodel): NoteViewmodel {
        if (n.type === 'Other note' && n.id !== undefined) {
            n.readonly = true;
        }

        return n;
    }
}
