import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingNoteListComponent } from './listing-note-list.component';
import { Component, Input } from '@angular/core';
import { ListingCreateNotesConfiguration } from '../../models/listing-create-notes-configuration.model';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { Note } from '../../../notes/models/note.model';
import { NoteType } from '../../../notes/models/note-type';

@Component({
    selector: 'app-note-list',
    template: '<p>Mock Product Settings Component</p>'
})
class MockNoteListComponent {
  @Input() notes;
  @Input() disabled;
}

let notesConfiguration = new ListingCreateNotesConfiguration();
let newNotePlaceholder = [notesConfiguration.getOrCreateNote([], NoteType.OTHER_NOTE)]
const specAndReqNotesPlaceholders = [
    notesConfiguration.getOrCreateNote([], NoteType.SPECIAL_REQUIREMENTS),
    notesConfiguration.getOrCreateNote([], NoteType.FACILITY_REQUIREMENTS)
]

describe('ListingNoteListComponent', () => {
  let component: ListingNoteListComponent;
  let fixture: ComponentFixture<ListingNoteListComponent>;
  let otherNote: Note;
  let specReqNote: Note;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [MockNoteListComponent, ListingNoteListComponent],
        providers: [ListingCreateNotesConfiguration, NotesPreparerService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingNoteListComponent);
    component = fixture.componentInstance;

    let baseNote: Note = {
        id: '1',
        type: undefined,
        content: 'a',
        entityId: undefined,
        entityType: undefined,
        createdAt: undefined,
        modifiedBy: undefined
    }

    otherNote = {
        ...baseNote,
        content: 'a',
        type: 'Other note'
    };

    specReqNote = {
        ...baseNote,
        content: 'a',
        type: 'Special Requirements'
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When providing a list of notes', () => {
    it('which is empty only default notes are present', () => {
      component.notes = [];
      fixture.detectChanges();

      expect(component.specialNoteViewModels).toEqual(specAndReqNotesPlaceholders);
      expect(component.newNoteViewModels.length).toEqual(1);
      expect(component.oldNoteViewModels).toEqual([]);
    })

    it('which has "Other note" already, this note is preserved and new one is added', () => {
        const otherNotes = [otherNote];
        component.notes = otherNotes;
        fixture.detectChanges();

        expect(component.oldNoteViewModels.length).toEqual(otherNotes.length);
        expect(component.newNoteViewModels).toEqual(newNotePlaceholder);
    })

    it('which has "Special Requirements" note already, this note is preserved', () => {
        component.notes = [specReqNote];
        fixture.detectChanges();

        let specReqNoteViewModel = component.specialNoteViewModels.find(n => n.type === NoteType.SPECIAL_REQUIREMENTS);

        expect(specReqNoteViewModel.content).toEqual(specReqNote.content);
        expect(specReqNoteViewModel.id).toEqual(specReqNote.id);
    })
  })
});
