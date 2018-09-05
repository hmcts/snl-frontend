import { HearingPart } from './../models/hearing-part';
import { reducer, initialState } from './hearing-part.reducer';
import { SearchComplete } from '../actions/hearing-part.action';
import { getHearingParts, State } from './index';

const hearingPartIdA = 'some-id-A';
const hearingPartA = generateHearingParts(hearingPartIdA);
const hearingPartIdB = 'some-id-B';
const hearingPartB = generateHearingParts(hearingPartIdB);
const hearingParts: HearingPart[] = [
    hearingPartA,
    hearingPartB
];
let state: State;

describe('HearingPartReducer', () => {
    describe('Search Complete', () => {
        beforeEach(() => {
            state = stateWith(reducer(initialState, new SearchComplete(hearingParts)));
        });

        it('should add hearing parts to store', () => {
            expect(Object.keys(getHearingParts(state)).length).toEqual(2);
            expect(getHearingParts(state)[hearingPartIdA]).toEqual(hearingPartA);
            expect(getHearingParts(state)[hearingPartIdB]).toEqual(hearingPartB);
        });

        it('when get empty array should remove saved hearing parts', () => {
            expect(Object.keys(getHearingParts(state)).length).toEqual(2);
            state = stateWith(reducer(state.hearingParts.hearingParts, new SearchComplete([])));
            expect(Object.keys(getHearingParts(state)).length).toEqual(0);
        });
    });
});

function stateWith(hearingPartReducer): State {
    return { hearingParts: { hearingParts: hearingPartReducer }}
};

function generateHearingParts(id: string): HearingPart {
    return {
        id: id,
        session: null,
        caseNumber: null,
        caseTitle: null,
        caseType: null,
        hearingType: null,
        duration: null,
        scheduleStart: null,
        scheduleEnd: null,
        version: null,
        priority: null,
        reservedJudgeId: null,
        communicationFacilitator: null,
        userTransactionId: null
    }
};
