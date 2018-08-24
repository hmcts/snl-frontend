import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ReferenceDataActions, ReferenceDataActionTypes } from '../actions/reference-data.action';
import { HearingType } from '../models/hearing-type';

export interface HearingTypeState extends EntityState<HearingType> {
}

export const adapter: EntityAdapter<HearingType> = createEntityAdapter<HearingType>();

export const initialHearingTypeState: HearingTypeState = adapter.getInitialState();

export function reducer(
    state = initialHearingTypeState,
    action: ReferenceDataActions
): HearingTypeState {
    switch (action.type) {
        case ReferenceDataActionTypes.GetAllHearingTypeComplete:
            const entities: HearingType[] = action.payload === undefined ? [] : Object.values(action.payload);
            return adapter.addAll(entities, state);
        default:
            return state;
    }
}

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();
