import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { RoomType } from '../models/room-type';
import { ReferenceDataActions, ReferenceDataActionTypes } from '../actions/reference-data.action';

export interface RoomTypeState extends EntityState<RoomType> {
}

export const adapter: EntityAdapter<RoomType> = createEntityAdapter<RoomType>({selectId: (model) => model.code});

export const initialState: RoomTypeState = adapter.getInitialState();

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();

export function reducer(
    state = initialState,
    action: ReferenceDataActions
): RoomTypeState {
    switch (action.type) {
        case ReferenceDataActionTypes.GetAllRoomTypeComplete:
            const entities: RoomType[] = action.payload === undefined ? [] : Object.values(action.payload);
            return adapter.addAll(entities, state);
        default:
            return state;
    }
}
