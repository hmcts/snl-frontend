import { initialState, reducer } from './room-type.reducer';
import * as fromReferenceData from '../actions/reference-data.action';
import * as fromHearingType from './hearing-type.reducer';
import { HearingType } from '../models/hearing-type';

let roomType = {
    code: 'code',
    description: 'desc'
} as HearingType;

let roomTypeTwo = {
    code: 'code2',
    description: 'desc2'
} as HearingType;

describe('RoomTypeReducer', () => {

    describe('When getting all room type is complete', () => {
        it('these hearing types should be in state', () => {
            let state = reducer(initialState, new fromReferenceData.GetAllRoomTypeComplete([roomType]));

            expect(fromHearingType.selectEntities(state)).toEqual({[roomType.code]: roomType});
        });

        it('the previous state entities should be replaced by new ones', () => {
            let state = reducer(initialState, new fromReferenceData.GetAllRoomTypeComplete([roomType]));
            state = reducer(state, new fromReferenceData.GetAllRoomTypeComplete([roomTypeTwo]));

            expect(fromHearingType.selectEntities(state)).toEqual({[roomTypeTwo.code]: roomTypeTwo});
        });
    });
});
