import { Note } from './../models/note.model';
import { NotesPreparerService } from './notes-preparer.service';

let note = {
    id: undefined,
    content: 'a',
    entityId: undefined,
    entityType: undefined
} as Note;

let alreadyExistentNote = {
    id: 'id',
    content: 'a',
    entityId: undefined,
    entityType: undefined
} as Note;

describe('NotePreparerService', () => {
    describe('When preparing the notes', () => {
        let service: NotesPreparerService;

        beforeEach(() => {
            service = new NotesPreparerService();
        })

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
    })
});
