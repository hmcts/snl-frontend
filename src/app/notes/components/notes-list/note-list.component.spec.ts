import { TestBed } from '@angular/core/testing';
import { NoteListComponent } from './note-list.component';
import { Note } from '../../models/note.model';

let noteListComponent: NoteListComponent;

let note = {
    id: '1',
    content: 'a',
    type: 't'
} as Note;

let secondNote = {
    id: '2',
    content: 'a',
    type: 't'
} as Note;

let notes = [note, secondNote];

describe('NoteListComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
            ],
            providers: [NoteListComponent]
        });

        noteListComponent = TestBed.get(NoteListComponent);
    });

    it('should create component', () => {
        expect(noteListComponent).toBeDefined();
    });

    describe('Getting only modified notes', () => {
        it('should return only modified notes', () => {
            noteListComponent.notes = notes;
            noteListComponent.noteViewModels[0].modified = true;

            let actualNotes = noteListComponent.getModifiedNotes();

            expect(actualNotes).toEqual([note]);
        });

        it('should return no notes if no modifications were done', () => {
            noteListComponent.notes = notes;

            let actualNotes = noteListComponent.getModifiedNotes();

            expect(actualNotes).toEqual([]);
        });
    })

});
