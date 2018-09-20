import * as fromRoot from '../../app.state';
import * as fromProblems from './problem.reducer';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity/src/models';
import { Problem } from '../models/problem.model';
import * as moment from 'moment';

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

export const getProblemsEntitiesArray = createSelector(
    getProblemsEntitiesState,
    state => state.entities
);

export const getProblems = createSelector<any, Dictionary<Problem>, Dictionary<Problem>>(
    getProblemsEntitiesArray,
    (problemEntities) => {
        if (!problemEntities) { return {} }

        Object.keys(problemEntities).map((key) => {
            problemEntities[key].createdAt = moment(problemEntities[key].createdAt);
         });

        return problemEntities;
    }
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
