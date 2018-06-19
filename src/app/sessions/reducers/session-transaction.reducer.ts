import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { SessionTransaction } from '../models/session-transaction-status.model';
import { SessionTransactionActionTypes, UpdateTransaction } from '../actions/session-transaction.action';
import { TransactionStatuses } from '../../core/services/transaction-backend.service';

export interface State extends EntityState<SessionTransaction> {
    recent: string
}
export const adapter: EntityAdapter<SessionTransaction> = createEntityAdapter<SessionTransaction>();
export const initialState: State = adapter.getInitialState({recent: ''});

export function reducer(state: State = initialState, action) {
  switch (action.type) {
    case SessionTransactionActionTypes.InitializeTransaction: {
        action.payload.problemsLoaded = false;
        action.payload.completed = false;
        action.payload.conflicted = false;

        return {...state, ...adapter.addOne(action.payload, {...state, recent: action.payload.id})}
    }
    case SessionTransactionActionTypes.TransactionComplete: {
        return upsertSession(state, action, false, 'Session creation complete', true, false);
    }
    case SessionTransactionActionTypes.TransactionConflicted: {
        return upsertSession(state, action, false, 'Session creation complete', true, true);
    }
    case SessionTransactionActionTypes.ProblemsLoaded: {
        return upsertSession(state, action, true, 'Problems loaded', true, false);
    }
    case SessionTransactionActionTypes.CommitTransaction:
    case SessionTransactionActionTypes.RollbackTransaction: {
      return {...state, loading: true};
    }
    case SessionTransactionActionTypes.UpdateTransaction: {
        let updatedSession = {
            id: action.payload.id,
            changes: {
                status: action.payload.status
            }
        } as Update<SessionTransaction>;
        return {...state, ...adapter.upsertOne(updatedSession, state)};
    }
    default:
        return state;
  }
}

function upsertSession(state, action, problemsLoaded: boolean, status: string, completed: boolean, conflicted: boolean) {
    let updatedSession = {
        id: action.payload,
        changes: {
            status: status,
            problemsLoaded: problemsLoaded,
            completed: completed,
            conflicted: conflicted
        }
    } as Update<SessionTransaction>;
    return {...state, ...adapter.upsertOne(updatedSession, state)};
}

export const getRecent = (state: State) => state.recent;
