import { HearingPartActionTypes } from '../actions/hearing-part.action';
import { HearingPart } from '../models/hearing-part';
import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';

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
    case HearingPartActionTypes.Delete:
    case HearingPartActionTypes.Create: {
        return {...state, loading: true};
    }
    case HearingPartActionTypes.CreateComplete: {
        return {...state, loading: false};
    }
    case HearingPartActionTypes.UpsertOne: {
      return {...state, ...adapter.upsertOne({id: action.payload.id, changes: action.payload},
              {...state, loading: false} )};
    }
    case HearingPartActionTypes.UpsertMany: {
        const updatedCollection = Object.values(action.payload || []).map((hearingPart: HearingPart) => {
            return {
                id: hearingPart.id,
                changes: hearingPart
            } as Update<HearingPart>;
        });
        return {...state, ...adapter.upsertMany(updatedCollection, {...state, loading: false})};
    }
    case HearingPartActionTypes.DeleteComplete: {
        return {...state, loading: false, ...adapter.removeOne(action.payload, state)}
    }
    default:
        return state;
  }
}

export const getHearingPartError = (state: State) => state.error;
export const getHearingPartLoading = (state: State) => state.loading;
