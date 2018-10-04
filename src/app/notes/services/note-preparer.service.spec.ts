import { Note } from './../models/note.model';
import { NotesPreparerService } from './notes-preparer.service';

let note = {
    id: undefined,
    content: 'a',
    entityId: undefined,
    entityType: undefined,
    createdAt: undefined,
} as Note;

let alreadyExistentNote = {
    id: 'id',
    content: 'a',
    entityId: undefined,
    entityType: undefined,
    createdAt: undefined
} as Note;

describe('NotePreparerService', () => {
    let service: NotesPreparerService;

    beforeEach(() => {
        service = new NotesPreparerService();
    })

    describe('When preparing the notes', () => {

        it('missing uuids should be generated', () => {
            let notes = service.prepare([note, note, note], 'parent-id', 'entity-name');

            notes.forEach(n => {
                expect(n.id).toBeDefined();
            })
        });

        it('parent id should be set', () => {
            let notes = service.prepare([note, note, note], 'parent-id', 'entity-name');

            notes.forEach(n => {
                expect(n.entityId).toEqual('parent-id');
            })
        });

        it('entity type should be set', () => {
            let notes = service.prepare([note, note, note], 'parent-id', 'entity-name');

            notes.forEach(n => {
                expect(n.entityType).toEqual('entity-name');
            })
        });

        it('with one old note its id should not be regenerated', () => {
            let notes = service.prepare([note, note, note, alreadyExistentNote], 'parent-id', 'entity-name');

            let alreadyExistentPreparedNote = notes.pop();

            expect(alreadyExistentPreparedNote.id).toEqual(alreadyExistentNote.id);

            notes.forEach(n => {
                expect(n.entityType).toEqual('entity-name');
            })
        });
    });

    describe('Removing empty notes', () => {
        it('should not remove notes that have content length !== 0', () => {

            let noteWithContentUndefined = {
                ...note,
                content: undefined
            } as Note;

            let noteWithContentLengthNonZero = {
                ...note,
                content: 'non zero content'
            } as Note;

            let notes = service.removeEmptyNotes([noteWithContentUndefined, noteWithContentLengthNonZero]);

            expect(notes.length).toEqual(1);
        })

        it('should remove notes that have content length = 0', () => {

            let noteWithContentLengthZero = {
                ...note,
                content: ''
            } as Note;

            let notes = service.removeEmptyNotes([noteWithContentLengthZero]);

            expect(notes.length).toEqual(0);
        })

        it('should remove notes that have content undefined or null', () => {

            let noteWithContentUndefined = {
                ...note,
                content: undefined
            } as Note;

            let noteWithContentNull = {
                ...note,
                content: null
            } as Note;

            let notes = service.removeEmptyNotes([noteWithContentUndefined, noteWithContentNull]);

            expect(notes.length).toEqual(0);
        })

        it('should remove notes that have only spaces', () => {

            let noteWithContentWithOnlySpaces = {
                ...note,
                content: '       '
            } as Note;

            let notes = service.removeEmptyNotes([noteWithContentWithOnlySpaces]);

            expect(notes.length).toEqual(0);
        })

        it('should not modify the note content', () => {

            let content = 'Content with some spaces';
            let noteWithContentWithSomeSpaces = {
                ...note,
                content: content
            } as Note;

            let notes = service.removeEmptyNotes([noteWithContentWithSomeSpaces]);

            expect(notes.length).toEqual(1);
            expect(notes[0].content).toEqual(content);
        })
    })
});
