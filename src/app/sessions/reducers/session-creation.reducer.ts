import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { SessionCreationStatus } from '../models/session-creation-status.model';
import { SessionCreationActionTypes } from '../actions/session-creation.action';

export interface State extends EntityState<SessionCreationStatus> {
    recent: string
}
export const adapter: EntityAdapter<SessionCreationStatus> = createEntityAdapter<SessionCreationStatus>();
export const initialState: State = adapter.getInitialState({recent: ''});

export function reducer(state: State = initialState, action) {
  switch (action.type) {
    case SessionCreationActionTypes.Create: {
        return upsertSession({...state, recent: action.payload}, action, true, 'Session creation started', false);
    }
    case SessionCreationActionTypes.CreateAcknowledged: {
        return upsertSession(state, action, true, 'Session creation acknowledged', false);
    }
    case SessionCreationActionTypes.CreateFailed: {
        return upsertSession(state, action, false, 'Session creation failed', true);
    }
    case SessionCreationActionTypes.CreateComplete: {
        return upsertSession(state, action, false, 'Session creation complete', true);
    }
    case SessionCreationActionTypes.RemoveOne: {
      return adapter.removeOne(action.payload.id, state);
    }
    default:
        return state;
  }
}

function upsertSession(state, action, inProgress: boolean, status: string, sessionCreated: boolean) {
    let updatedSession = {
        id: action.payload,
        changes: {
            status: status,
            inProgress: inProgress,
            sessionCreated: sessionCreated
        }
    } as Update<SessionCreationStatus>;
    return {...state, ...adapter.upsertOne(updatedSession, state)};
}

export const getSessions = (state: State) => state.entities;
export const getRecent = (state: State) => state.recent;
