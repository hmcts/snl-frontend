import { Note } from '../../notes/models/note.model';
import { NotesConfiguration } from '../../notes/models/notes-configuration';
import { Injectable } from '@angular/core';

@Injectable()
export class SessionCreateNotesConfiguration implements NotesConfiguration {
    public readonly entityName;

    constructor() {
        this.entityName = 'Session';
    }

    public defaultNotes(): Note[] {
        const otherNote = {
            id: undefined,
            content: '',
            type: 'Notes'
        } as Note;

        return [otherNote];
    }
}
