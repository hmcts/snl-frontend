import { HearingPartActionTypes } from '../actions/hearing-part.action';

import * as fromRoot from '../../app.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HearingPart } from '../models/hearing-part';
import * as moment from 'moment';

export interface HearingPartState {
    readonly entities: HearingPart[];
    readonly loading: boolean;
    readonly error: string;
}

const initialState: HearingPartState = {
    entities: [
        {
            id: 'asd',
            caseNumber: 'asd',
            caseType: 'asd',
            hearingType: 'asd',
            duration: moment.duration('10'),
            scheduleStart: new Date(),
            scheduleEnd: new Date(),
        } as HearingPart
    ] as HearingPart[],
    loading: false,
    error: '',
};

export interface State extends fromRoot.State {
    hearingParts: HearingPartState;
}

export const getRootHearingPartState = createFeatureSelector<State>('hearingParts');
export const getHearingPartState = createSelector(getRootHearingPartState, state => state.hearingParts);
export const getHearingPartEntities = createSelector(getHearingPartState, state => state.entities);
export const getHearingPartLoading = createSelector(getHearingPartState, state => state.loading);
export const getHearingPartError = createSelector(getHearingPartState, state => state.error);

export function hearingPartReducer(state: HearingPartState = initialState, action) {
  switch (action.type) {
    case HearingPartActionTypes.Search: {
        return {...state, loading: true};
    }
    case HearingPartActionTypes.SearchFailed: {
        return {...state, loading: false, error: action.payload};
    }
    case HearingPartActionTypes.SearchComplete: {
        return {entities: action.payload, loading: false};
    }
    case HearingPartActionTypes.Create: {
        return {...state, loading: true};
    }
    case HearingPartActionTypes.CreateFailed: {
        return {...state, loading: false, error: action.payload};
    }
    case HearingPartActionTypes.CreateComplete: {
        return {...state, loading: false};
    }
    case HearingPartActionTypes.AssignToSession: {
      return {...state, loading: true};
    }
    case HearingPartActionTypes.AssignComplete: {
      return {...state, loading: false};
    }
    case HearingPartActionTypes.AssignFailed: {
      return {...state, loading: false, error: action.payload};
    }
    default:
        return state;
  }
}
