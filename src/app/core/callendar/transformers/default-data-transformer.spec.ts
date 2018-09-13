import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import * as moment from 'moment';
import { DefaultDataTransformer } from './default-data-transformer';
import { IcalendarTransformer } from './icalendar-transformer';
import { SessionType } from '../../reference/models/session-type';

const room = { name: 'room' }
const person = { name: 'person' }
let session = {
    id: 'id',
    start: moment(),
    duration: 60,
    room: room,
    person: person,
    sessionType: { code: 'session-type-code', description: 'session-type-description' } as SessionType,
    hearingParts: [],
    jurisdiction: ''
} as SessionViewModel;

let expectedEvent = {
    title: `${session.room.name} - ${session.person.name} - ${session.sessionType.description}`,
    start: session.start,
    end: moment(moment(session.start).add(moment.duration(session.duration))),
    id: session.id,
    hearingParts: session.hearingParts,
    color: 'gray',
    room: room,
    person: person
};

let sessionWithoutJudgeAndRoomAndSessiontype = {
    ...session,
    person: undefined,
    room: undefined,
    sessionType: undefined,
} as SessionViewModel;

let expectedEventWithoutJudgeAndRoomAndSessiontype = {
    ...expectedEvent,
    title: `No Room - No Judge - No Session type`,
    color: 'gray',
    room: undefined,
    person: undefined
}

let sessionWithIdUndefined = {
    ...session,
    id: undefined
}

let expectedEventWithIdUndefined = sessionWithIdUndefined;

let tests = [
    {
        name: 'with all fields defined',
        session: session,
        expectedEvent: expectedEvent
    }, {
        name: 'without judge, room and Sessiontype',
        session: sessionWithoutJudgeAndRoomAndSessiontype,
        expectedEvent: expectedEventWithoutJudgeAndRoomAndSessiontype
    }, {
        name: 'with undefined id',
        session: sessionWithIdUndefined,
        expectedEvent: expectedEventWithIdUndefined
    }
];

describe('DefaultDataTransformer', () => {

    let dataTransformer: IcalendarTransformer<SessionViewModel>;

    beforeAll(() => {
        dataTransformer = new DefaultDataTransformer();
    });

    describe('Transforming a session', () => {
        tests.forEach(test => {
            it(`${test.name} should give proper event object`, () => {
                expect(dataTransformer.transform(test.session)).toEqual(test.expectedEvent);
            });
        })
    });
});
