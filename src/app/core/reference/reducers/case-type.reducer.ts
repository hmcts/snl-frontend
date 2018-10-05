import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { CaseType } from '../models/case-type';
import { ReferenceDataActions, ReferenceDataActionTypes } from '../actions/reference-data.action';

export interface CaseTypeState extends EntityState<CaseType> {
}

export const adapter: EntityAdapter<CaseType> = createEntityAdapter<CaseType>({selectId: (model) => model.code});

export const initialState: CaseTypeState = adapter.getInitialState();

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();

export function reducer(
    state = initialState,
    action: ReferenceDataActions
): CaseTypeState {
    if (action.type === ReferenceDataActionTypes.GetAllCaseTypeComplete) {
        const entities: CaseType[] = action.payload === undefined ? [] : Object.values(action.payload);
        return adapter.addAll(entities, state);
    } else {
        return state;
    }
}
