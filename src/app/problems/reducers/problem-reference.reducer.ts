
import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';

import { ProblemReference } from '../models/problem-reference.model';
import { ProblemReferenceActionTypes } from '../actions/problem-reference.action';

export interface State extends EntityState<ProblemReference> {}

export const adapter: EntityAdapter<ProblemReference> = createEntityAdapter<ProblemReference>();

export const initialState: State = adapter.getInitialState({});

export function reducer(state: State = initialState, action) {
    switch (action.type) {
        case ProblemReferenceActionTypes.UpsertMany: {
            let updatedCollection = Object.values(action.payload || []).map((problemRef: ProblemReference) => {
                return {
                    id: problemRef.id,
                    changes: problemRef
                } as Update<ProblemReference>;
            });
            return {...state, ...adapter.upsertMany(updatedCollection, {...state, loading: false})};
        }
        default:
            return state;
    }
}

export const getProblemReferences = (state: State) => state.entities;
