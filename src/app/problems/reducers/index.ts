import * as fromRoot from '../../app.state';
import * as fromProblems from './problem.reducer';
import * as fromProblemReferences from './problem-reference.reducer';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { ProblemViewmodel } from '../models/problem.viewmodel';
import { ProblemReference } from '../models/problem-reference.model';

export interface ProblemsState {
    readonly problems: fromProblems.State;
    readonly problemReferences: fromProblemReferences.State
}

export interface State extends fromRoot.State {
    problems: ProblemsState;
}

export const reducers: ActionReducerMap<ProblemsState> = {
    problems: fromProblems.reducer,
    problemReferences: fromProblemReferences.reducer
};

export const getProblemsState = createFeatureSelector<ProblemsState>('problems');
export const getProblemsEntitiesState = createSelector(
    getProblemsState,
    state => state.problems
);

export const getProblemsReferencesEntitesState = createSelector(
    getProblemsState,
    state => state.problemReferences
);

export const getProblemsReferences = createSelector(
    getProblemsReferencesEntitesState,
    state => state.entities
);

export const getProblems = createSelector(
    getProblemsEntitiesState,
    state => state.entities
);

export const getProblemsLoading = createSelector(
    getProblemsEntitiesState,
    fromProblems.getLoading
);

export const getProblemsWithReferences = createSelector(getProblems, getProblemsReferences,
    (problems, problemReferences) => {
        let fullProblems: ProblemViewmodel[];
        fullProblems = Object.values(problems).map(problem => {
            let problemRefs: ProblemReference[];
            problemRefs = problem.references.map(ref => {
                return problemReferences[ref];
            });
            return {
                id: problem.id,
                severity: problem.severity,
                type: problem.type,
                references: problemRefs
            } as ProblemViewmodel;
        });

        return fullProblems;
    }
);

export const {
    selectIds: getProblemsIds,
    selectEntities: getProblemsEntities,
    selectAll: getAllProblems,
    selectTotal: getTotalProblems,
} = fromProblems.adapter.getSelectors(getProblemsEntitiesState);
