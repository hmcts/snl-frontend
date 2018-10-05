import { NotesListDialogComponent } from './notes-list-dialog.component';

let noteListDialogComponent: NotesListDialogComponent;

describe('NotesListDialogComponent', () => {
    this.specReqNote = {};
    this.facReqNote = {};
    this.otherNote = {};

    beforeEach(() => {
        this.note = {
            id: '1',
            content: '',
            type: '',
            entityId: 'p',
            entityType: 'e',
            createdAt: undefined,
            modifiedBy: undefined
        };

        this.specReqNote = {
            ...this.note,
            type: 'Special Requirements'
        }

        this.facReqNote = {
            ...this.note,
            type: 'Facility Requirements'
        }

        this.otherNote = {
            ...this.note,
            type: 'Other note'
        }

        const matDialogRefSpy = jasmine.createSpyObj('MatDialog', ['close']);
        this.noteViewModels = [this.specReqNote, this.facReqNote, this.otherNote];
        noteListDialogComponent = new NotesListDialogComponent(matDialogRefSpy, this.noteViewModels);
    });

    describe('When notes are passed into constructor', () => {
        it('they are disposed into proper arrays based on their type', () => {
            expect(noteListDialogComponent.noteViewModels).toEqual([this.specReqNote, this.facReqNote]);
            expect(noteListDialogComponent.freeTextNoteViewModels).toEqual([this.otherNote]);
        });

        it('"Special Requirements" note is first and "Facility Requirements" note is second in order', () => {
            expect(noteListDialogComponent.noteViewModels[0]).toEqual(this.specReqNote);
            expect(noteListDialogComponent.noteViewModels[1]).toEqual(this.facReqNote);
        });
    })

});
