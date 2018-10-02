import { Component, Input, ViewChild } from '@angular/core';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { Note } from '../../../notes/models/note.model';
import { ListingCreateNotesConfiguration } from '../../models/listing-create-notes-configuration.model';
import { getNoteViewModel, NoteViewmodel } from '../../../notes/models/note.viewmodel';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';

@Component({
  selector: 'app-listing-note-list',
  templateUrl: './listing-note-list.component.html',
  styleUrls: ['./listing-note-list.component.scss']
})
export class ListingNoteListComponent {
  @ViewChild('notesList') noteList: NoteListComponent;
  @ViewChild('freeTextNotesList') freeTextNoteList: NoteListComponent;

  public _notes: Note[];
  public noteViewModels: NoteViewmodel[] = [];
  public freeTextNoteViewModels: NoteViewmodel[] = [];

  @Input() set notes(value: Note[]) {
      this._notes = value;
      this.initiateNotes(this._notes);
  }

  @Input()
  public entityId: string;

  constructor(readonly listingNotesConfig: ListingCreateNotesConfiguration,
            public notePreparerService: NotesPreparerService) { }

  initiateNotes(notes: Note[]) {
      this._notes = this.setNotesIfExist(notes);

      this._notes.map(getNoteViewModel)
          .map(this.disableShowingCreationDetailsOnNewNotes)
          .map(this.makeExistingFreetextNotesReadonly)
          .forEach(this.disposeToProperArrays);
  }

  prepareNotes() {
      let preparedNotes = this.notePreparerService.prepare(
          this.noteList.getModifiedNotes(),
          this.entityId,
          this.listingNotesConfig.entityName
      );

      let preparedFreeTextNotes = this.notePreparerService.prepare(
          this.freeTextNoteList.getModifiedNotes(),
          this.entityId,
          this.listingNotesConfig.entityName
      );

      return [...preparedNotes, ...preparedFreeTextNotes];
  }

  protected setNotesIfExist(notes: Note[]) {
      let defaultNotes = this.listingNotesConfig.defaultNotes().map(defaultNote => {
          const alreadyExistingNote = notes.find(note => note.type === defaultNote.type);
          if (alreadyExistingNote !== undefined) {
              notes = notes.filter(n => n.id !== alreadyExistingNote.id);
          }

          return alreadyExistingNote || defaultNote
      });

      let combinedNotes = [...defaultNotes, ...notes];

      if (this.containsOldFreeTextNote(combinedNotes)) {
          return [this.listingNotesConfig.getNewFreeTextNote(), ...combinedNotes];
      } else {
          return combinedNotes;
      }
  }

  protected containsOldFreeTextNote(notes: Note[]) {
      return notes.find(n => n.type === 'Other note' && n.id === undefined) === undefined;
  }

  protected disableShowingCreationDetailsOnNewNotes(note: NoteViewmodel): NoteViewmodel {
      if (note.id === undefined) {
          note.displayCreationDetails = false;
      }
      return note;
  }

  protected makeExistingFreetextNotesReadonly(n: NoteViewmodel): NoteViewmodel {
      if (n.type === 'Other note' && n.id !== undefined) {
          n.readonly = true;
      }

      return n;
  }

  protected disposeToProperArrays = (n: NoteViewmodel) => {
      if (n.type === 'Other note') {
          this.freeTextNoteViewModels.push(n);
      } else {
          this.noteViewModels.push(n);
      }
  }
}
