import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { Note } from '../../../notes/models/note.model';
import { NoteViewmodel } from '../../../notes/models/note.viewmodel';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { ListingNotesViewModelPreparerService } from '../../services/listing-notes-viewmodel-preparer.service';

@Component({
  selector: 'app-listing-note-list',
  templateUrl: './listing-note-list.component.html',
  styleUrls: ['./listing-note-list.component.scss']
})
export class ListingNoteListComponent implements OnInit {
  @ViewChild('notesList') noteList: NoteListComponent;
  @ViewChild('freeTextNotesList') freeTextNoteList: NoteListComponent;

  private _notes: Note[];
  public noteViewModels: NoteViewmodel[] = [];
  public freeTextNoteViewModels: NoteViewmodel[] = [];

  @Input() set notes(value: Note[]) { this._notes = value; }
  @Input() public entityId: string;

  ngOnInit() {
      this.initiateNotes(this._notes);
  }

  constructor(readonly viewModelPreparerService: ListingNotesViewModelPreparerService,
            public notePreparerService: NotesPreparerService) { }

  initiateNotes(notes: Note[]) {
      this.viewModelPreparerService.prepare(notes)
          .forEach(this.disposeToProperArrays);
  }

  prepareNotes() {
      let preparedNotes = this.notePreparerService.prepare(
          this.noteList.getModifiedNotes(),
          this.entityId,
          this.viewModelPreparerService.notesConfig.entityName
      );

      let preparedFreeTextNotes = this.notePreparerService.prepare(
          this.freeTextNoteList.getModifiedNotes(),
          this.entityId,
          this.viewModelPreparerService.notesConfig.entityName
      );
      preparedFreeTextNotes = this.notePreparerService.removeEmptyNotes(preparedFreeTextNotes);

      return [...preparedNotes, ...preparedFreeTextNotes];
  }

  private disposeToProperArrays = (n: NoteViewmodel) => {
      if (n.type === 'Other note') {
          this.freeTextNoteViewModels.push(n);
      } else {
          this.noteViewModels.push(n);
      }
  }
}
