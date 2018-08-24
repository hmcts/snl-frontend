
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { JudgeActionTypes } from '../actions/judge.action';
import { Judge } from '../models/judge.model';

export interface State extends EntityState<Judge> {
    loading: boolean | false;
}

export const adapter: EntityAdapter<Judge> = createEntityAdapter<Judge>();

export const initialState: State = adapter.getInitialState({
    loading: false,
});

export function reducer(state: State = initialState, action) {
    switch (action.type) {
        case JudgeActionTypes.Get: {
            return {...state, loading: true};
        }
        case JudgeActionTypes.GetFailed: {
            return {...state, loading: false, error: action.payload};
        }
        case JudgeActionTypes.GetComplete: {
            return adapter.addAll(action.payload === undefined ? [] : Object.values(action.payload), {...state, loading: false});
        }
        default:
            return state;
    }
}

export const getJudgesState = (state: State) => state;
export const getJudges = (state: State) => state.entities;
export const getLoading = (state: State) => state.loading;
