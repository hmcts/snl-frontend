import { Session } from './../models/session.model';
import { reducer, initialState } from './session.reducer';
import { SearchComplete } from '../actions/session.action';
import { getSessionEntities } from './index';
import { State } from './index'

const sessionIdA = 'some-id-A';
const sessionA = generateSession(sessionIdA);
const sessionIdB = 'some-id-B';
const sessionB = generateSession(sessionIdB);
const sessions: Session[] = [
    sessionA,
    sessionB
];
let state: State;

describe('SessionReducer', () => {
    describe('Search Complete', () => {
        beforeEach(() => {
            state = stateWith(reducer(initialState, new SearchComplete(sessions)));
        });

        it('should add sessions to store', () => {
            expect(Object.keys(getSessionEntities(state)).length).toEqual(2);
            expect(getSessionEntities(state)[sessionIdA]).toEqual(sessionA);
            expect(getSessionEntities(state)[sessionIdB]).toEqual(sessionB);
        });

        it('when get empty array should remove saved sessions', () => {
            expect(Object.keys(getSessionEntities(state)).length).toEqual(2);
            state = stateWith(reducer(state.sessions.sessions, new SearchComplete([])));
            expect(Object.keys(getSessionEntities(state)).length).toEqual(0);
        });
    });
});

function stateWith(sessionReducer): State {
    return { sessions: { sessions: sessionReducer, rooms: null }}
}

function generateSession(id: string): Session {
    return {
        id: id,
        start: null,
        duration: null,
        room: null,
        person: null,
        caseType: null,
        sessionTypeCode: null,
        jurisdiction: 'some jurisdiction',
        version: 0
    }
};
