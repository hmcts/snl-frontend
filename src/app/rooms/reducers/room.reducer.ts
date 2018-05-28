
import { Room } from '../models/room.model';
import { RoomActionTypes } from '../actions/room.action';
import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';

export interface State extends EntityState<Room> {
    loading: boolean | false;
}

export const adapter: EntityAdapter<Room> = createEntityAdapter<Room>();

export const initialState: State = adapter.getInitialState({
    loading: false,
});

export function reducer(state: State = initialState, action) {
  switch (action.type) {
    case RoomActionTypes.Get: {
        return {...state, loading: true};
    }
    case RoomActionTypes.GetFailed: {
        return {...state, loading: false, error: action.payload};
    }
    case RoomActionTypes.GetComplete: {
        return adapter.addAll( action.payload === undefined ? [] : Object.values(action.payload), {...state, loading: false});
    }
    case RoomActionTypes.UpsertMany: {
      let updatedCollection = Object.values(action.payload || []).map((room: Room) => {
          return {
              id: room.id,
              changes: room
          } as Update<Room>;
      });
      return {...state, ...adapter.upsertMany(updatedCollection, {...state, loading: false})};
    }
    default:
        return state;
  }
}

export const getRoomsState = (state: State) => state;
export const getRooms = (state: State) => state.entities;
export const getLoading = (state: State) => state.loading;
