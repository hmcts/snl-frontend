import * as fromRoot from '../../app.state';
import * as fromNotes from './note.reducer';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

export interface NotesState {
    readonly notes: fromNotes.State;
}

export interface State extends fromRoot.State {
    notes: NotesState;
}

export const reducers: ActionReducerMap<NotesState> = {
    notes: fromNotes.reducer,
};

export const getNotesFeatureState = createFeatureSelector<NotesState>('notes');
export const getNotesState = createSelector(
    getNotesFeatureState,
    state => state.notes
);

export const getNotes = createSelector(
    getNotesState,
    fromNotes.getNotes
);

export const getNotesLoading = createSelector(
    getNotesState,
    fromNotes.getLoading
);

export const {
    selectIds: getNotesIds,
    selectEntities: getNotesEntities,
    selectAll: getAllNotes,
    selectTotal: getTotalNotes,
} = fromNotes.adapter.getSelectors(getNotesState);
