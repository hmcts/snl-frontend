import { Injectable } from '@angular/core';
import { NotesViewModelPreparerService } from '../../notes/services/notes-viewmodel-preparer.service';
import { ListingCreateNotesConfiguration } from '../models/listing-create-notes-configuration.model';

@Injectable()
export class ListingNotesViewModelPreparerService extends NotesViewModelPreparerService {
    constructor() {
        super();
        this.notesConfig = new ListingCreateNotesConfiguration()
    }
}
