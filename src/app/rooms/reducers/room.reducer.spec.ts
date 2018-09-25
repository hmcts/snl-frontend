import { reducer, initialState } from './room.reducer';
import { GetComplete } from '../actions/room.action';
import { getRooms } from '.';
import { State } from '../../sessions/reducers/index'
import { Room } from '../models/room.model';

const roomIdA = 'some-id-A';
const roomA = generateRoom(roomIdA);
const roomIdB = 'some-id-B';
const roomB = generateRoom(roomIdB);
const rooms: Room[] = [
    roomA,
    roomB
];
let state: State;

describe('RoomReducer', () => {
    describe('Get Complete', () => {
        beforeEach(() => {
            state = stateWith(reducer(initialState, new GetComplete(rooms)));
        });

        it('should add rooms to store', () => {
            expect(Object.keys(getRooms(state)).length).toEqual(2);
            expect(getRooms(state)[roomIdA]).toEqual(roomA);
            expect(getRooms(state)[roomIdB]).toEqual(roomB);
        });

        it('when get empty array should remove saved rooms', () => {
            expect(Object.keys(getRooms(state)).length).toEqual(2);
            state = stateWith(reducer(state.sessions.rooms, new GetComplete([])));
            expect(Object.keys(getRooms(state)).length).toEqual(0);
        });
    });
});

function stateWith(roomReducer): State {
    return { sessions: { rooms: roomReducer, sessions: null }}
};

function generateRoom(id: string): Room {
    return {
        id: id,
        name: null,
        roomTypeCode: 'code'
    }
};
