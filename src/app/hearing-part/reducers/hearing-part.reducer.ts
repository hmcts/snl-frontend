import { HearingPartActionTypes } from '../actions/hearing-part.action';

import { HearingPart } from '../models/hearing-part';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

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
        return {...state, ...adapter.addAll(action.payload === undefined ? [] : Object.values(action.payload), {...state, loading: false})};
    }
    case HearingPartActionTypes.Create: {
        return {...state, loading: true};
    }
    case HearingPartActionTypes.CreateComplete: {
        return {...state, loading: false};
    }
    case HearingPartActionTypes.AssignComplete: {
      return {...state, loading: false};
    }
    default:
        return state;
  }
}

export const {
    selectIds: getHearingPartIds,
    selectEntities: getHearingPartEntities,
    selectAll: getAllHearingParts,
    selectTotal: getTotalHearingParts,
} = adapter.getSelectors();

export const getHearingPartError = (state: State) => state.error;

