import * as fromRoot from '../../app.state';
import * as fromJudges from './judge.reducer';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

export interface JudgesState {
    readonly judges: fromJudges.State;
}

export interface State extends fromRoot.State {
    judges: JudgesState;
}

export const reducers: ActionReducerMap<JudgesState> = {
    judges: fromJudges.reducer,
};

export const getJudgesState = createFeatureSelector<JudgesState>('judges');
export const getJudgesEntitiesState = createSelector(
    getJudgesState,
    state => state.judges
);

export const getJudges = createSelector(
    getJudgesEntitiesState,
    state => state.entities
);

export const {
    selectIds: getJudgesIds,
    selectEntities: getJudgesEntities,
    selectAll: getAllJudges,
    selectTotal: getTotalJudges,
} = fromJudges.adapter.getSelectors(getJudgesEntitiesState);
