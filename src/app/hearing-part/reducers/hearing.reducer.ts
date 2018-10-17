import { HearingActionTypes } from '../actions/hearing.action';
import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { Hearing } from '../models/hearing';

export interface State extends EntityState<Hearing> {}

export const adapter: EntityAdapter<Hearing> = createEntityAdapter<Hearing>();

export const initialState: State = adapter.getInitialState({});

export function reducer(state: State = initialState, action) {
  switch (action.type) {
    case HearingActionTypes.SearchFailed:
    case HearingActionTypes.CreateFailed:
    case HearingActionTypes.AssignFailed: {
        return {...state, error: action.payload};
    }
    case HearingActionTypes.SearchComplete: {
        return {...state, ...adapter.addAll(action.payload === undefined ? [] : Object.values(action.payload),
                {...state})};
    }
    case HearingActionTypes.UpsertOne: {
      return {...state, ...adapter.upsertOne({id: action.payload.id, changes: action.payload},
              {...state} )};
    }
    case HearingActionTypes.UpsertMany: {
        const updatedCollection = Object.values(action.payload || []).map((hearing: Hearing) => {
            return {
                id: hearing.id,
                changes: hearing
            } as Update<Hearing>;
        });
        return {...state, ...adapter.upsertMany(updatedCollection, {...state})};
    }
    case HearingActionTypes.DeleteComplete: {
        return {...state, ...adapter.removeOne(action.payload, state)}
    }
    case HearingActionTypes.Clear: {
        return { ...initialState }
    }
    default:
        return state;
  }
}

export const getHearings = (state: State) => state.entities;
