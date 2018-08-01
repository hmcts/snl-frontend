import * as fromRoot from '../../app.state';
import * as fromRooms from './room.reducer';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { SessionsState } from '../../sessions/reducers';

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

export const {
    selectIds: getRoomsIds,
    selectEntities: getRoomsEntities,
    selectAll: getAllRooms,
    selectTotal: getTotalRooms,
} = fromRooms.adapter.getSelectors(getRoomsEntitiesState);
