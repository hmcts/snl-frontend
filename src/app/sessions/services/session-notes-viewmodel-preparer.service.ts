import { Injectable } from '@angular/core';
import { NotesViewModelPreparerService } from '../../notes/services/notes-viewmodel-preparer.service';
import { SessionCreateNotesConfiguration } from '../models/session-create-notes-configuration.model';

@Injectable()
export class SessionNotesViewModelPreparerService extends NotesViewModelPreparerService {
    constructor() {
        super();
        this.notesConfig = new SessionCreateNotesConfiguration()
    }
}
