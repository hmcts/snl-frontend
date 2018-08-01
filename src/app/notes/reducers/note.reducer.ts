
import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { NoteActionTypes } from '../actions/notes.action';
import { Note } from '../models/note.model';

export interface State extends EntityState<Note> {
    loading: boolean | false;
}

export const adapter: EntityAdapter<Note> = createEntityAdapter<Note>();

export const initialState: State = adapter.getInitialState({
    loading: false,
});

export function reducer(state: State = initialState, action) {
    switch (action.type) {
        case NoteActionTypes.Get:
        case NoteActionTypes.CreateMany:
        case NoteActionTypes.Create: {
            return {...state, loading: true};
        }
        case NoteActionTypes.UpsertOne: {
            const updatedNote = {
                id: action.payload.id,
                changes: action.payload
            } as Update<Note>;
            return {...state, ...adapter.upsertOne(updatedNote, {...state, loading: false})};
        }
        case NoteActionTypes.UpsertMany: {
            const updatedCollection = Object.values(action.payload || []).map((note: Note) => {
                return {
                    id: note.id,
                    changes: note
                } as Update<Note>;
            });
            return {...state, ...adapter.upsertMany(updatedCollection, {...state, loading: false})};
        }
        default:
            return state;
    }
}

export const getNotes = (state: State) => state.entities;
export const getLoading = (state: State) => state.loading;
