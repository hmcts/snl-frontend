import { Note } from '../../notes/models/note.model';
import { Injectable } from '@angular/core';

@Injectable()
export class HearingAssignmentNotesConfiguration {
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
