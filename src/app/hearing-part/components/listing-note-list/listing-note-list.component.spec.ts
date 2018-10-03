import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingNoteListComponent } from './listing-note-list.component';
import { Component, Input } from '@angular/core';
import { ListingCreateNotesConfiguration } from '../../models/listing-create-notes-configuration.model';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { Note } from '../../../notes/models/note.model';

@Component({
    selector: 'app-note-list',
    template: '<p>Mock Product Settings Component</p>'
})
class MockNoteListComponent {
  @Input() notes;
  @Input() disabled;
}

describe('ListingNoteListComponent', () => {
  let component: ListingNoteListComponent;
  let notesConfiguration: ListingCreateNotesConfiguration;
  let fixture: ComponentFixture<ListingNoteListComponent>;
  let otherNote: Note;
  let specReqNote: Note;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
        ],
      declarations: [MockNoteListComponent, ListingNoteListComponent],
        providers: [ListingCreateNotesConfiguration, NotesPreparerService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    notesConfiguration = TestBed.get(ListingCreateNotesConfiguration);
    fixture = TestBed.createComponent(ListingNoteListComponent);
    component = fixture.componentInstance;

    otherNote = {
        id: '1',
        content: 'a',
        type: 'Other note'
    } as Note;

    specReqNote = {
        id: '1',
        content: 'a',
        type: 'Special Requirements'
    } as Note;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When providing a list of notes', () => {
    it('which is empty only default notes are present', () => {
      component.notes = [];
      fixture.detectChanges();

      let actualNotesCount = component.freeTextNoteViewModels.length + component.noteViewModels.length;
      let expectedDefaultNotesCount = notesConfiguration.defaultNotes().length;
      expect(actualNotesCount).toEqual(expectedDefaultNotesCount);
    })

    it('which has \'Other note\' already, this note is preserved and new one is added', () => {
        component.notes = [otherNote];
        fixture.detectChanges();

        expect(component.freeTextNoteViewModels.length).toEqual(2);
        expect(component.noteViewModels.length).toEqual(2);
    })

    it('which has \'Special Requirements\' note already, this note is preserved', () => {
        component.notes = [specReqNote];
        fixture.detectChanges();

        let specReqNoteViewModel = component.noteViewModels.find(n => n.type === 'Special Requirements');

        expect(specReqNoteViewModel.content).toEqual(specReqNote.content);
        expect(specReqNoteViewModel.id).toEqual(specReqNote.id);
    })

    it('all existing \'Other notes\' are readonly', () => {
        component.notes = [otherNote];
        fixture.detectChanges();

        component.freeTextNoteViewModels
            .filter(n => n.id !== undefined) // remove the new note
            .forEach(n => {
                expect(n.readonly).toBeTruthy()
            });
    })

    it('newly added \'Other note\' is NOT readonly', () => {
        component.notes = [otherNote];
        fixture.detectChanges();

        component.freeTextNoteViewModels
            .filter(n => n.id === undefined) // remove the new note
            .forEach(n => {
                expect(n.readonly).toBeFalsy()
            });
    })

    it('\'Spec Req\' and \'Fac Req\' notes are NOT readonly', () => {
        component.notes = [];
        fixture.detectChanges();

        component.noteViewModels
            .forEach(n => {
                expect(n.readonly).toBeFalsy()
            });
    })

    it('already existing notes should display their creation details', () => {
        component.notes = [otherNote];
        fixture.detectChanges();

        component.freeTextNoteViewModels
            .filter(n => n.id !== undefined) // remove the new note
            .forEach(n => {
                expect(n.displayCreationDetails).toBeTruthy()
            });
    })

    it('new notes should not display their creation details', () => {
        component.notes = [otherNote];
        fixture.detectChanges();

        component.freeTextNoteViewModels
            .filter(n => n.id === undefined) // remove the new note
            .forEach(n => {
                expect(n.displayCreationDetails).toBeFalsy()
            });
    })
  })
});
