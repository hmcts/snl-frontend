import { reducer, initialState, State, getHearings } from './hearing.reducer';
import { UpsertMany, UpsertOne } from '../actions/hearing.action';

let state: State;

describe('HearingReducer', () => {
    describe('Upsert', () => {

        it('should add one hearing to store', () => {
            state = reducer(initialState, new UpsertOne({id: 'id1'}));

            expect(getHearings(state)['id1']).toBeDefined();
        });

        it('should add many hearings to store', () => {
            state = reducer(initialState, new UpsertMany([{id: 'id1'}, {id: 'id2'}]));

            expect(getHearings(state)['id1']).toBeDefined();
            expect(getHearings(state)['id2']).toBeDefined();
        });
    });
});
