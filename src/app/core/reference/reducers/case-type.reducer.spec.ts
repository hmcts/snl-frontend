import { initialState, reducer } from './case-type.reducer';
import * as fromReferenceData from '../actions/reference-data.action';
import { CaseType } from '../models/case-type';
import * as fromCaseType from './case-type.reducer';

let caseType = {
    code: 'code',
    description: 'desc'
} as CaseType;

let caseTypeTwo = {
    code: 'code2',
    description: 'desc2'
} as CaseType;

describe('CaseTypeReducer', () => {

    describe('When getting all case type is complete', () => {
        it('these case types should be in state', () => {
            let state = reducer(initialState, new fromReferenceData.GetAllCaseTypeComplete([caseType]));

            expect(fromCaseType.selectEntities(state)).toEqual({[caseType.code]: caseType});
        });

        it('the previous state entities should be replaced by new ones', () => {
            let state = reducer(initialState, new fromReferenceData.GetAllCaseTypeComplete([caseType]));
            state = reducer(initialState, new fromReferenceData.GetAllCaseTypeComplete([caseTypeTwo]));

            expect(fromCaseType.selectEntities(state)).toEqual({[caseTypeTwo.code]: caseTypeTwo});
        });
    });
});
