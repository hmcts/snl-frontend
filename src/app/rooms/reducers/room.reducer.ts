
import * as fromRoot from '../../app.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Room } from '../models/room.model';
import { JudgeActionTypes } from '../../judges/actions/judge.action';

export interface RoomState {
    readonly entities: Room[];
    readonly loading: boolean;
    readonly error: string;
}

const initialState: RoomState = {
    entities: [{name: 'Room one'}, {name: 'Room two'}, {name: 'Room three'}, {name: 'Room four'}, {name: 'Room five'}],
    loading: false,
    error: '',
};

export interface State extends fromRoot.State {
    rooms: RoomState;
}

export const getRootRoomsState = createFeatureSelector<State>('sessions');
export const getRoomsState = createSelector(getRootRoomsState, state => state.rooms);
export const getRoomsEntities = createSelector(getRoomsState, state => state.entities);
export const getRoomsLoading = createSelector(getRoomsState, state => state.loading);
export const getRoomsError = createSelector(getRoomsState, state => state.error);

export function roomReducer(state: RoomState = initialState, action) {
  switch (action.type) {
    case JudgeActionTypes.Get: {
        return {...state, loading: true};
    }
    case JudgeActionTypes.GetFailed: {
        return {...state, loading: false, error: action.payload};
    }
    case JudgeActionTypes.GetComplete: {
        return {entities: action.payload, loading: false};
    }
    default:
        return state;
  }
}
