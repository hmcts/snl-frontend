import * as fromRoot from '../../app.state';
import * as fromProblems from './problem.reducer';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

export interface ProblemsState {
    readonly problems: fromProblems.State;
}

export interface State extends fromRoot.State {
    problems: ProblemsState;
}

export const reducers: ActionReducerMap<ProblemsState> = {
    problems: fromProblems.reducer,
};

export const getProblemsState = createFeatureSelector<ProblemsState>('problems');
export const getProblemsEntitiesState = createSelector(
    getProblemsState,
    state => state.problems
);


export const getProblems = createSelector(
    getProblemsEntitiesState,
    state => state.entities
);

export const getProblemsLoading = createSelector(
    getProblemsEntitiesState,
    fromProblems.getLoading
);

export const {
    selectIds: getProblemsIds,
    selectEntities: getProblemsEntities,
    selectAll: getAllProblems,
    selectTotal: getTotalProblems,
} = fromProblems.adapter.getSelectors(getProblemsEntitiesState);
