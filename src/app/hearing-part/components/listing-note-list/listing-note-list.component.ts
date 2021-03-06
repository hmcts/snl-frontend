import { ListingCreateNotesConfiguration } from '../../models/listing-create-notes-configuration.model';
import { Component, Input, ViewChild } from '@angular/core';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { isOfTypeOtherOrListing, Note } from '../../../notes/models/note.model';
import { getNoteViewModel, NoteViewmodel, sortNotesByLatestFirst } from '../../../notes/models/note.viewmodel';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { NoteType } from '../../../notes/models/note-type';

@Component({
    selector: 'app-listing-note-list',
    templateUrl: './listing-note-list.component.html',
    styleUrls: ['./listing-note-list.component.scss']
})
export class ListingNoteListComponent {
    @ViewChild('specialNotesList') specialNotesList: NoteListComponent;
    @ViewChild('newNoteList') newNoteList: NoteListComponent;

    public specialNoteViewModels: NoteViewmodel[] = [];
    public newNoteViewModels: NoteViewmodel[] = [this.listingNotesConfig.noteViewModelOf(NoteType.OTHER_NOTE)];
    public oldNoteViewModels: NoteViewmodel[] = [];

    @Input() public entityId: string;

    @Input() set notes(notes: Note[]) {
        this.specialNoteViewModels = [];
        this.oldNoteViewModels = [];
        this.newNoteViewModels = [this.listingNotesConfig.noteViewModelOf(NoteType.OTHER_NOTE)];

        notes
            .map(getNoteViewModel)
            .forEach(this.disposeToProperArrays);

        this.specialNoteViewModels = [
            this.listingNotesConfig.getOrCreateNote(this.specialNoteViewModels, NoteType.SPECIAL_REQUIREMENTS),
            this.listingNotesConfig.getOrCreateNote(this.specialNoteViewModels, NoteType.FACILITY_REQUIREMENTS),
        ];

        this.oldNoteViewModels = sortNotesByLatestFirst(this.oldNoteViewModels);
    }

    constructor(private readonly listingNotesConfig: ListingCreateNotesConfiguration,
                private notePreparerService: NotesPreparerService) {
    }

    prepareNotes() {
        const preparedFreeTextNotes = this.notePreparerService.prepare(
            this.specialNotesList.getModifiedNotes(),
            this.entityId,
            this.listingNotesConfig.entityName
        );

        const preparedNotes = this.notePreparerService.prepare(
            this.newNoteList.getModifiedNotes(),
            this.entityId,
            this.listingNotesConfig.entityName
        );

        return [...preparedNotes, ...preparedFreeTextNotes];
    }

    protected disposeToProperArrays = (n: NoteViewmodel) => {
        if (isOfTypeOtherOrListing(n)) {
            this.oldNoteViewModels.push(n);
        } else {
            this.specialNoteViewModels.push(n);
        }
    };
}
