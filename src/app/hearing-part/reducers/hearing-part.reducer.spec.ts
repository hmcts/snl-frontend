import { HearingPart } from './../models/hearing-part';
import { reducer, initialState, State, getHearingPartEntities } from './hearing-part.reducer';
import { SearchComplete } from '../actions/hearing-part.action';
import * as moment from 'moment';

const hearingPartIdA = 'some-id-A';
const hearingPartA = generateHearingParts(hearingPartIdA);
const hearingPartIdB = 'some-id-B';
const hearingPartB = generateHearingParts(hearingPartIdB);
const nowMoment = moment();
const nowISOSting = nowMoment.toISOString();
const hearingParts: HearingPart[] = [
    hearingPartA,
    hearingPartB
];
let state: State;

describe('HearingPartReducer', () => {
    describe('Search Complete', () => {
        beforeEach(() => {
            state = reducer(initialState, new SearchComplete(hearingParts));
        });

        it('should add hearing parts to store', () => {
            expect(Object.keys(getHearingPartEntities(state)).length).toEqual(2);
            expect(getHearingPartEntities(state)[hearingPartIdA]).toEqual(hearingPartA);
            expect(getHearingPartEntities(state)[hearingPartIdB]).toEqual(hearingPartB);
        });

        it('when get empty array should remove saved hearing parts', () => {
            expect(Object.keys(getHearingPartEntities(state)).length).toEqual(2);
            state = reducer(state, new SearchComplete([]));
            expect(Object.keys(getHearingPartEntities(state)).length).toEqual(0);
        });
    });
});

function generateHearingParts(id: string): HearingPart {
    return {
        id: id,
        sessionId: null,
        hearingInfo: '',
        version: null,
        start: nowISOSting
    }
}
