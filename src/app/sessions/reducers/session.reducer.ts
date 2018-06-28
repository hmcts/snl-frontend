import { SessionActionTypes } from '../actions/session.action';
import { Session } from '../models/session.model';

import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';

export interface State extends EntityState<Session> {
    loading: boolean | false;
    error: string | '';
    sessionPropositions: any[];
    loadingPropositions: boolean | false;
}

export const adapter: EntityAdapter<Session> = createEntityAdapter<Session>();

export const initialState: State = adapter.getInitialState({
    loading: false,
    error: '',
    sessionPropositions: [],
    loadingPropositions: false
});

export function reducer(state: State = initialState, action) {
    switch (action.type) {
        case SessionActionTypes.Search: {
            return {...state, loading: true};
        }
        case SessionActionTypes.SearchForDates: {
            return {...state, loading: true};
        }
        case SessionActionTypes.SearchFailed: {
            return {...state, loading: false, error: action.payload};
        }
        case SessionActionTypes.SearchComplete: {
            return {...state, ...adapter.addAll(Object.values(action.payload || []), {...state, loading: false})};
        }
        case SessionActionTypes.DeleteOne: {
            return {...state, ...adapter.removeOne(action.payload, {...state, loading: false})};
        }
        case SessionActionTypes.UpsertOne: {
            let updatedSession = {
                id: action.payload.id,
                changes: action.payload
            } as Update<Session>;
            return {...state, ...adapter.upsertOne(updatedSession, {...state, loading: false})};
        }
        case SessionActionTypes.UpsertMany: {
            let updatedCollection = Object.values(action.payload || []).map((session: Session) => {
                return {
                    id: session.id,
                    changes: session
                } as Update<Session>;
            });
            return {...state, ...adapter.upsertMany(updatedCollection, {...state, loading: false})};
        }
        case SessionActionTypes.Create: {
            return {...state, loading: true};
        }
        case SessionActionTypes.CreateFailed: {
            return {...state, loading: false, error: action.payload};
        }
        case SessionActionTypes.CreateComplete: {
            return {...state, loading: false};
        }
        case SessionActionTypes.AddPropositions: {
            return {...state, sessionPropositions: action.payload, loadingPropositions: false};
        }
        case SessionActionTypes.SearchPropositions: {
            return {...state, loadingPropositions: true};
        }
        default:
            return state;
    }
}

export const getSessions = (state: State) => state.entities;
export const getLoading = (state: State) => state.loading;
export const getSessionPropositionsLoading = (state: State) => state.loadingPropositions;
export const getError = (state: State) => state.error;
