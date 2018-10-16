import { Injectable } from '@angular/core';
import { NoteConfiguration } from '../../notes/services/note-configuration';

@Injectable()
export class SessionCreateNotesConfiguration extends NoteConfiguration {
    public readonly entityName = 'Session';
}
