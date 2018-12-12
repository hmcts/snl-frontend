import { NotesListDialogComponent } from './notes-list-dialog.component';
import moment = require('moment');
import { NoteType } from '../../models/note-type';

let noteListDialogComponent: NotesListDialogComponent;

describe('NotesListDialogComponent', () => {
    this.specReqNote = {};
    this.facReqNote = {};
    this.listingReqNote = {};
    this.otherNote = {};
    this.olderOtherNote = {};

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
            type: NoteType.SPECIAL_REQUIREMENTS
        }

        this.facReqNote = {
            ...this.note,
            type: NoteType.FACILITY_REQUIREMENTS
        }

        this.listingReqNote = {
            ...this.note,
            type: NoteType.LISTING_NOTE,
            createdAt: moment()
        }

        this.olderOtherNote = {
            ...this.note,
            type: NoteType.OTHER_NOTE,
            createdAt: moment().subtract(1, 'day')
        }

        this.otherNote = {
            ...this.note,
            type: NoteType.OTHER_NOTE,
            createdAt: moment()
        }

        this.oldestOtherNote = {
            ...this.note,
            type: NoteType.OTHER_NOTE,
            createdAt: moment().subtract(2, 'day')
        }

        const matDialogRefSpy = jasmine.createSpyObj('MatDialog', ['close']);
        this.noteViewModels = [this.specReqNote, this.facReqNote, this.listingReqNote,
            this.olderOtherNote, this.oldestOtherNote, this.otherNote];
        noteListDialogComponent = new NotesListDialogComponent(matDialogRefSpy, this.noteViewModels);
    });

    describe('When notes are passed into constructor', () => {
        it('they are disposed into proper arrays based on their type', () => {
            expect(noteListDialogComponent.noteViewModels).toEqual([this.specReqNote, this.facReqNote]);
            expect(noteListDialogComponent.freeTextNoteViewModels).toEqual([
                this.listingReqNote,
                this.otherNote,
                this.olderOtherNote,
                this.oldestOtherNote]);
        });

        it('"Special Requirements" note is first and "Facility Requirements" note is second in order', () => {
            expect(noteListDialogComponent.noteViewModels[0]).toEqual(this.specReqNote);
            expect(noteListDialogComponent.noteViewModels[1]).toEqual(this.facReqNote);
        });
    })
});
