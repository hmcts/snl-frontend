import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { SessionTransaction } from '../models/session-creation-status.model';
import { SessionCreationActionTypes } from '../actions/session-creation.action';

export interface State extends EntityState<SessionTransaction> {
    recent: string
}
export const adapter: EntityAdapter<SessionTransaction> = createEntityAdapter<SessionTransaction>();
export const initialState: State = adapter.getInitialState({recent: ''});

export function reducer(state: State = initialState, action) {
  switch (action.type) {
    case SessionCreationActionTypes.Create: {
        action.payload.problemsLoaded = false;
        action.payload.sessionCreated = false;
        console.log(action.payload);

        return {...state, ...adapter.addOne(action.payload, {...state, recent: action.payload.id})}
    }
    case SessionCreationActionTypes.CreateAcknowledged: {
        return upsertSession(state, action, false, 'Session creation acknowledged', false);
    }
    case SessionCreationActionTypes.CreateFailed: {
        return upsertSession(state, action, false, 'Session creation failed', true);
    }
    case SessionCreationActionTypes.CreateComplete: {
        return upsertSession(state, action, false, 'Session creation complete', true);
    }
    case SessionCreationActionTypes.ProblemsLoaded: {
        return upsertSession(state, action, true, 'Problems loaded', true);
    }
    case SessionCreationActionTypes.RemoveOne: {
      return adapter.removeOne(action.payload.id, state);
    }
    default:
        return state;
  }
}

function upsertSession(state, action, problemsLoaded: boolean, status: string, sessionCreated: boolean) {
    console.log('================');
    console.log(action);
    let updatedSession = {
        id: action.payload,
        changes: {
            status: status,
            problemsLoaded: problemsLoaded,
            sessionCreated: sessionCreated,
        }
    } as Update<SessionTransaction>;
    return {...state, ...adapter.upsertOne(updatedSession, state)};
}

export const getSessions = (state: State) => state.entities;
export const getRecent = (state: State) => state.recent;
