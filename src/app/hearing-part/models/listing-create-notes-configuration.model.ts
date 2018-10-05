import { Note } from '../../notes/models/note.model';
import { NotesConfiguration } from '../../notes/models/notes-configuration';
import { Injectable } from '@angular/core';

@Injectable()
export class ListingCreateNotesConfiguration implements NotesConfiguration {
    public readonly entityName;

    constructor() {
        this.entityName = 'ListingRequest';
    }

    public getNewFreeTextNote(): Note {
        return {
            id: undefined,
            content: '',
            type: 'Other note'
        } as Note;
    }

    public defaultNotes(): Note[] {
        const specReqNote = {
            id: undefined,
            content: '',
            type: 'Special Requirements'
        } as Note;

        const facReqNote = {
            id: undefined,
            content: '',
            type: 'Facility Requirements'
        } as Note;

        const otherNote = {
            id: undefined,
            content: '',
            type: 'Other note'
        } as Note;

        return [specReqNote, facReqNote, otherNote];
    }
}
