import { initialState, reducer, getNotes, getLoading } from './note.reducer';
import * as fromNotes from '../actions/notes.action';
import { Note } from '../models/note.model';

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

describe('NoteReducer', () => {

    describe('When upserting', () => {
        it('a note this note should be in state', () => {
            let state = reducer(initialState, new fromNotes.UpsertOne(note));

            expect(getNotes(state)).toEqual({[note.id]: note});
        });
        it('many notes these notes should be in state', () => {
            let state = reducer(initialState, new fromNotes.UpsertMany([note, secondNote]));

            expect(getNotes(state)).toEqual({[note.id]: note, [secondNote.id]: secondNote});
        });
    });

    describe('The \'loading\' flag should be true when', () => {
        [   new fromNotes.Get(),
            new fromNotes.CreateMany([note])
        ].forEach(action => {
            it(`'${action.type}' is dispatched`, () => {
                let state = reducer(initialState, action);

                expect(getLoading(state)).toEqual(true);
            })
        })
    });

});
