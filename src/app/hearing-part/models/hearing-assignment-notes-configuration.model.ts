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
        const otherNote = {
            id: undefined,
            content: '',
            type: 'Other note'
        } as Note;

        return [otherNote];
    }
}
