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
            sessionId: 'b32bf0f7-8a71-4cb2-8596-70559c56f4c8',
            caseNumber: 'asd',
            caseType: 'asd',
            hearingType: 'asd',
            duration: moment.duration('10'),
            scheduleStart: new Date(),
            scheduleEnd: new Date(),
        } as HearingPart, {
            id: 'ds',
            sessionId: 'bc0f52f1-c090-4f1d-8b8d-ef4091c170d9',
            caseNumber: 'd',
            caseType: 'aa',
            hearingType: 'd',
            duration: moment.duration('23'),
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
        return {entities: action.payload, loading: false};
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
