import { initialState, reducer } from './session-type.reducer';
import * as fromReferenceData from '../actions/reference-data.action';
import * as fromHearingType from './hearing-type.reducer';
import { HearingType } from '../models/hearing-type';

let sessionType = {
    code: 'code',
    description: 'desc'
} as HearingType;

let sessionTypeTwo = {
    code: 'code2',
    description: 'desc2'
} as HearingType;

describe('SessionTypeReducer', () => {

    describe('When getting all session type is complete', () => {
        it('these hearing types should be in state', () => {
            let state = reducer(initialState, new fromReferenceData.GetAllSessionTypeComplete([sessionType]));

            expect(fromHearingType.selectEntities(state)).toEqual({[sessionType.code]: sessionType});
        });

        it('the previous state entities should be replaced by new ones', () => {
            let state = reducer(initialState, new fromReferenceData.GetAllSessionTypeComplete([sessionType]));
            state = reducer(state, new fromReferenceData.GetAllSessionTypeComplete([sessionTypeTwo]));

            expect(fromHearingType.selectEntities(state)).toEqual({[sessionTypeTwo.code]: sessionTypeTwo});
        });
    });
});
