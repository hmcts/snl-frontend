import { HearingPartActionTypes } from '../actions/hearing-part.action';

import * as fromRoot from '../../app.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HearingPart } from '../models/hearing-part';

export interface HearingPartState {
    readonly entities: HearingPart[];
    readonly loading: boolean;
    readonly error: any;
}

const initialState: HearingPartState = {
    entities: [] as HearingPart[],
    loading: false,
    error: '',
};

export interface State extends fromRoot.State {
    hearingParts: HearingPartState;
}

export const getRootHearingPartState = createFeatureSelector<State>('hearingParts');
export const getHearingPartState = createSelector(getRootHearingPartState, state => state.hearingParts);
export const getHearingPartLoading = createSelector(getHearingPartState, state => state.loading);
export const getHearingPartError = createSelector(getHearingPartState, state => state.error);

export function hearingPartReducer(state: HearingPartState = initialState, action) {
    switch (action.type) {
        case HearingPartActionTypes.CreateFailed: {
            return {...state, loading: false, error: action.payload};
        }
        case HearingPartActionTypes.Create: {
            return {...state, loading: true};
        }
        case HearingPartActionTypes.CreateComplete: {
            return {...state, loading: false};
        }
        default:
            return state;
    }
}
