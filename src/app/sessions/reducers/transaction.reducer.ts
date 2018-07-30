import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { EntityTransaction } from '../models/transaction-status.model';
import { EntityTransactionActionTypes } from '../actions/transaction.action';

export interface State extends EntityState<EntityTransaction> {
    recent: string
}
export const adapter: EntityAdapter<EntityTransaction> = createEntityAdapter<EntityTransaction>();
export const initialState: State = adapter.getInitialState({recent: ''});

export function reducer(state: State = initialState, action) {
  switch (action.type) {
    case EntityTransactionActionTypes.InitializeTransaction: {
        action.payload.problemsLoaded = false;
        action.payload.completed = false;
        action.payload.conflicted = false;

        return {...state, ...adapter.addOne(action.payload, {...state, recent: action.payload.id})}
    }
    case EntityTransactionActionTypes.TransactionComplete: {
        return upsertSession(state, action, false, true, false);
    }
    case EntityTransactionActionTypes.TransactionConflicted: {
        return upsertSession(state, action, false,  true, true);
    }
    case EntityTransactionActionTypes.ProblemsLoaded: {
        return upsertSession(state, action, true,  true, false);
    }
    case EntityTransactionActionTypes.CommitTransaction:
    case EntityTransactionActionTypes.RollbackTransaction: {
      return {...state, loading: true};
    }
    default:
        return state;
  }
}

function upsertSession(state, action, problemsLoaded: boolean, completed: boolean, conflicted: boolean) {
    const updatedSession = {
        id: action.payload,
        problemsLoaded,
        completed,
        conflicted
    } as EntityTransaction;
    return {...state, ...adapter.upsertOne(updatedSession, state)};
}

export const getRecent = (state: State) => state.recent;
