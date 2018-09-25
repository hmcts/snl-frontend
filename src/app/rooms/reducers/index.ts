import * as fromRoot from '../../app.state';
import * as fromRooms from './room.reducer';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { SessionsState } from '../../sessions/reducers';
import { Dictionary } from '@ngrx/entity/src/models';
import { Room } from '../models/room.model';

export interface RoomsState {
    readonly rooms: fromRooms.State;
}

export interface State extends fromRoot.State {
    rooms: RoomsState;
}

export const reducers: ActionReducerMap<RoomsState> = {
    rooms: fromRooms.reducer,
};

export const getSessionNode = createFeatureSelector<SessionsState>('sessions');

export const getRoomsEntitiesState = createSelector(
    getSessionNode,
    state => state.rooms
);

export const getRooms = createSelector(
    getRoomsEntitiesState,
    state => state.entities
);

export const getRoomsLoading = createSelector(
    getRoomsEntitiesState,
    fromRooms.getLoading
);

export const getRoomById = (id: string) => createSelector(getRooms, (rooms: Dictionary<Room>) => {
    return rooms[id];
});

export const {
    selectIds: getRoomsIds,
    selectEntities: getRoomsEntities,
    selectAll: getAllRooms,
    selectTotal: getTotalRooms,
} = fromRooms.adapter.getSelectors(getRoomsEntitiesState);
