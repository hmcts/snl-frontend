
import * as fromRoot from '../../app.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Judge } from '../models/judge.model';
import { JudgeActionTypes } from '../actions/judge.action';

export interface JudgeState {
    readonly entities: Judge[];
    readonly loading: boolean;
    readonly error: string;
}

const initialState: JudgeState = {
    entities: [{id: 1, name: 'Judge one'}, {id: 2, name: 'Judge two'}, {id: 3, name: 'Judge three'}, {id: 4, name: 'Judge four'}, {id: 5, name: 'Judge five'}],
    loading: false,
    error: '',
};

export interface State extends fromRoot.State {
    judges: JudgeState;
}

export const getRootJudgesState = createFeatureSelector<State>('sessions');
export const getJudgesState = createSelector(getRootJudgesState, state => state.judges);
export const getJudgesEntities = createSelector(getJudgesState, state => state.entities);
export const getJudgesLoading = createSelector(getJudgesState, state => state.loading);
export const getJudgesError = createSelector(getJudgesState, state => state.error);

export function judgeReducer(state: JudgeState = initialState, action) {
  switch (action.type) {
    case JudgeActionTypes.Get: {
        return state;
    }
    case JudgeActionTypes.GetFailed: {
        return {...state, loading: false, error: action.payload};
    }
    case JudgeActionTypes.GetComplete: {
        return {entities: action.payload, loading: false};
    }
    default:
        return state;
  }
}
