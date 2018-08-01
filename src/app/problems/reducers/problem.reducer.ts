import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { Problem } from '../models/problem.model';
import { ProblemActionTypes } from '../actions/problem.action';

export interface State extends EntityState<Problem> {
    loading: boolean | false;
    error: string | '';
}

export const adapter: EntityAdapter<Problem> = createEntityAdapter<Problem>();

export const initialState: State = adapter.getInitialState({
    loading: false,
    error: ''
});

export function reducer(state: State = initialState, action) {
    switch (action.type) {
        case ProblemActionTypes.Get: {
            return {...state, loading: true};
        }
        case ProblemActionTypes.GetForSession: {
            return {...state, loading: true};
        }
        case ProblemActionTypes.GetFailed: {
            return {...state, loading: false, error: action.payload};
        }
        case ProblemActionTypes.RemoveAll: {
            return {...state, ...adapter.removeAll(state)};
        }
        case ProblemActionTypes.GetComplete: {
            return {...state, ...adapter.addAll(Object.values(action.payload || []), {...state, loading: false})};
        }
        case ProblemActionTypes.UpsertMany: {
            const updatedCollection = Object.values(action.payload || []).map((problem: Problem) => {
                return {
                    id: problem.id,
                    changes: problem
                } as Update<Problem>;
            });
            return {...state, ...adapter.upsertMany(updatedCollection, {...state, loading: false})};        }
        default:
            return state;
    }
}

export const getProblems = (state: State) => state.entities;
export const getLoading = (state: State) => state.loading;
export const getError = (state: State) => state.error;
