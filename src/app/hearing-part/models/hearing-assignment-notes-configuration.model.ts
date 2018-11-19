import { Note } from '../../notes/models/note.model';
import { Injectable } from '@angular/core';
import { NoteType } from '../../notes/models/note-type';

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
            type: NoteType.LISTING_NOTE
        } as Note;

        return [note];
    }
}
