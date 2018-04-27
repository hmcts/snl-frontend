import { SessionActionTypes } from '../actions/session.action';
import { Session } from '../models/session.model';

import * as fromRoot from '../../app.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRooms from '../../rooms/reducers/room.reducer';

export interface SessionsState {
    readonly entities: Session[];
    readonly loading: boolean;
    readonly error: string;
}

const initialState: SessionsState = {
    entities: [] as Session[],
    loading: false,
    error: '',
};

export interface State extends fromRoot.State {
    sessions: SessionsState;
}

export const getRootSessionsState = createFeatureSelector<State>('sessions');
export const getSessionsState = createSelector(getRootSessionsState, state => state.sessions);
export const getSessionsEntities = createSelector(getSessionsState, state => state.entities);
export const getSessionsLoading = createSelector(getSessionsState, state => state.loading);
export const getSessionsError = createSelector(getSessionsState, state => state.error);

export function sessionReducer(state: SessionsState = initialState, action) {
  switch (action.type) {
    case SessionActionTypes.Search: {
        return {...state, loading: true};
    }
    case SessionActionTypes.SearchFailed: {
        return {...state, loading: false, error: action.payload};
    }
    case SessionActionTypes.SearchComplete: {
        return {entities: action.payload, loading: false};
    }
    case SessionActionTypes.Create: {
        return {...state, loading: true};
    }
    case SessionActionTypes.CreateFailed: {
        return {...state, loading: false, error: action.payload};
    }
    case SessionActionTypes.CreateComplete: {
        return {...state, entities: [...state.entities, action.payload], loading: false};
    }
    default:
        return state;
  }
}
