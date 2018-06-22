import { HearingPartActionTypes, UpsertMany, UpsertOne } from '../actions/hearing-part.action';

import { HearingPart } from '../models/hearing-part';
import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { Session } from '../../sessions/models/session.model';

export interface State extends EntityState<HearingPart> {
    loading: boolean | false;
    error: string | '';
}

export const adapter: EntityAdapter<HearingPart> = createEntityAdapter<HearingPart>();

export const initialState: State = adapter.getInitialState({
    loading: false,
    error: ''
});

export function reducer(state: State = initialState, action) {
  switch (action.type) {
    case HearingPartActionTypes.Search:
    case HearingPartActionTypes.AssignToSession: {
        return {...state, loading: true};
    }
    case HearingPartActionTypes.SearchFailed:
    case HearingPartActionTypes.CreateFailed:
    case HearingPartActionTypes.AssignFailed: {
        return {...state, loading: false, error: action.payload};
    }
    case HearingPartActionTypes.SearchComplete: {
        return {...state, ...adapter.addAll(action.payload === undefined ? [] : Object.values(action.payload),
                {...state, loading: false})};
    }
    case HearingPartActionTypes.Create: {
        return {...state, loading: true};
    }
    case HearingPartActionTypes.CreateComplete: {
        return {...state, loading: false};
    }
    case HearingPartActionTypes.AssignComplete: {
      return {...state, ...adapter.upsertOne({id: action.payload.id, changes: action.payload},
              {...state, loading: false} )};
    }
    case HearingPartActionTypes.UpsertOne: {
      return {...state, ...adapter.upsertOne({id: action.payload.id, changes: action.payload},
              {...state, loading: false} )};
    }
    case HearingPartActionTypes.UpsertMany: {
        let updatedCollection = Object.values(action.payload || []).map((hearingPart: HearingPart) => {
            return {
                id: hearingPart.id,
                changes: hearingPart
            } as Update<HearingPart>;
        });
        return {...state, ...adapter.upsertMany(updatedCollection, {...state, loading: false})};
    }
    default:
        return state;
  }
}

export const getHearingPartError = (state: State) => state.error;
export const getHearingPartLoading = (state: State) => state.loading;
