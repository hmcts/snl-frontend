import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { SessionType } from '../models/session-type';
import { ReferenceDataActions, ReferenceDataActionTypes } from '../actions/reference-data.action';

export interface SessionTypeState extends EntityState<SessionType> {
}

export const adapter: EntityAdapter<SessionType> = createEntityAdapter<SessionType>({selectId: (model) => model.code});

export const initialState: SessionTypeState = adapter.getInitialState();

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();

export function reducer(
    state = initialState,
    action: ReferenceDataActions
): SessionTypeState {
    switch (action.type) {
        case ReferenceDataActionTypes.GetAllSessionTypeComplete:
            const entities: SessionType[] = action.payload === undefined ? [] : Object.values(action.payload);
            return adapter.addAll(entities, state);
        default:
            return state;
    }
}
