import { Note } from '../../notes/models/note.model';
import { NotesConfiguration } from '../../notes/models/notes-configuration';
import { Injectable } from '@angular/core';

@Injectable()
export class HearingAssignmentNotesConfiguration implements NotesConfiguration {
    public readonly entityName;

    constructor() {
        this.entityName = 'ListingRequest';
    }

    public defaultNotes(): Note[] {
        const note = {
            id: undefined,
            content: '',
            type: 'Listing note'
        } as Note;

        return [note];
    }
}
