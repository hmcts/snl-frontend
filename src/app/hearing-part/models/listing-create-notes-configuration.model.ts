import { Injectable } from '@angular/core';
import { NoteConfiguration } from '../../notes/services/note-configuration';

@Injectable()
export class ListingCreateNotesConfiguration extends NoteConfiguration {
    public readonly entityName = 'ListingRequest'
}
