import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '../../app.state';
import { Session } from '../../sessions/models/session.model';
import { DiaryActions, DiaryActionTypes } from '../actions/diary.actions';

export interface DiarySessionsState {
    readonly entities: Session[];
    readonly error: string;
}

export const initialState: DiarySessionsState = {
    entities: [],
    error: ''
};

export interface DiaryState extends fromRoot.State {
    sessions: DiarySessionsState
}

export const getRootDiarySessionsState = createFeatureSelector<DiaryState>('judgeSessions');
export const getDiarySessionsState = createSelector(getRootDiarySessionsState, state => state.sessions);

export const getSessionsEntities = createSelector(getDiarySessionsState, state => state.entities);
export const getSessionsError = createSelector(getDiarySessionsState, state => state.error);

export function reducer(state = initialState, action: DiaryActions) {
    switch (action.type) {
        case DiaryActionTypes.DiaryLoadSessions: {
            return {...state};
        }
        case DiaryActionTypes.DiaryLoadFailed: {
            return {...state, error: action.payload};
        }
        case DiaryActionTypes.DiaryLoadComplete: {
            return {entities: action.payload, error: undefined};
        }
        default:
            return state;
    }
}
