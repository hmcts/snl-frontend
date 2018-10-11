import { Note } from '../../notes/models/note.model';
import { NotesConfiguration } from '../../notes/models/notes-configuration';
import { Injectable } from '@angular/core';

@Injectable()
export class SessionCreateNotesConfiguration implements NotesConfiguration {
    public readonly entityName;

    constructor() {
        this.entityName = 'Session';
    }

    public getNewFreeTextNote(): Note {
        return {
            id: undefined,
            content: '',
            type: 'Other note'
        } as Note;
    }

    public defaultNotes(): Note[] {
        return [this.getNewFreeTextNote()];
    }
}
