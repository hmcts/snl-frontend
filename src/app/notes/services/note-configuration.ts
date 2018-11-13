import { NoteViewmodel } from '../models/note.viewmodel';
import { NoteType } from '../models/note-type';

export class NoteConfiguration {
    public getOrCreateNote(notes: NoteViewmodel[], ofType: NoteType, inputLabel: string = undefined) {
        const note = notes.find(n => n.type === ofType)
        return note || this.noteViewModelOf(ofType, inputLabel)
    }

    public noteViewModelOf(noteType: NoteType, inputLabel: string = undefined) {
        return this.noteViewModel(noteType, inputLabel)
    }

    private noteViewModel(type: NoteType, inputLabel: string = undefined): NoteViewmodel {
        inputLabel = inputLabel || type;
        return {
            id: undefined,
            type,
            content: '', // it needs to be an empty string as its required by formControl in NoteComponent
            entityId: undefined,
            entityType: undefined,
            createdAt: undefined,
            modifiedBy: undefined,
            modified: false,
            inputLabel: inputLabel,
        }
    }
}
