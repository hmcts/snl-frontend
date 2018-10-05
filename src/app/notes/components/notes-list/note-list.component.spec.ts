import { TestBed } from '@angular/core/testing';
import { NoteListComponent } from './note-list.component';

let noteListComponent: NoteListComponent;

describe('NoteListComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
            ],
            providers: [NoteListComponent]
        });

        this.note = {
            id: '1',
            content: 'a',
            type: 't',
            entityId: 'p',
            entityType: 'e',
            createdAt: undefined,
            modifiedBy: undefined
        };

        this.secondNote = {
            id: '2',
            content: 'a',
            type: 't',
            entityId: 'p',
            entityType: 'e',
            createdAt: undefined,
            modifiedBy: undefined
        };

        this.noteVm = {
            ...this.note,
            modified: false,
            inputLabel: 'lbl'
        }

        this.secondNoteVm = {
            ...this.secondNote,
            modified: false,
            inputLabel: 'lbl'
        }

        this.noteViewModels = [this.noteVm, this.secondNoteVm];

        noteListComponent = TestBed.get(NoteListComponent);
    });

    it('should create component', () => {
        expect(noteListComponent).toBeDefined();
    });

    describe('Getting only modified notes', () => {
        it('should return only modified notes', () => {
            noteListComponent.notes = this.noteViewModels;
            noteListComponent.noteViewModels[0].modified = true;

            let actualNotes = noteListComponent.getModifiedNotes();

            expect(actualNotes).toEqual([this.note]);
        });

        it('should return no notes if no modifications were done', () => {
            noteListComponent.notes = this.noteViewModels;

            let actualNotes = noteListComponent.getModifiedNotes();

            expect(actualNotes).toEqual([]);
        });
    })

});
