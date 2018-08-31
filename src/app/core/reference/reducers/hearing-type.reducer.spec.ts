import { initialHearingTypeState, reducer } from './hearing-type.reducer';
import * as fromReferenceData from '../actions/reference-data.action';
import * as fromHearingType from './hearing-type.reducer';
import { HearingType } from '../models/hearing-type';

let hearingType = {
    code: 'code',
    description: 'desc'
} as HearingType;

let hearingTypeTwo = {
    code: 'code2',
    description: 'desc2'
} as HearingType;

describe('HearingTypeReducer', () => {

    describe('When getting all hearing type is complete', () => {
        it('these hearing types should be in state', () => {
            let state = reducer(initialHearingTypeState, new fromReferenceData.GetAllHearingTypeComplete([hearingType]));

            expect(fromHearingType.selectEntities(state)).toEqual({[hearingType.code]: hearingType});
        });

        it('the previous state entities should be replaced by new ones', () => {
            let state = reducer(initialHearingTypeState, new fromReferenceData.GetAllHearingTypeComplete([hearingType]));
            state = reducer(state, new fromReferenceData.GetAllHearingTypeComplete([hearingTypeTwo]));

            expect(fromHearingType.selectEntities(state)).toEqual({[hearingTypeTwo.code]: hearingTypeTwo});
        });
    });
});
