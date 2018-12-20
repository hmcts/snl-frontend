import { SessionViewModel, SessionCalendarViewModel } from '../../../sessions/models/session.viewmodel';
import * as moment from 'moment';
import { DefaultDataTransformer } from './default-data-transformer';
import { IcalendarTransformer } from './icalendar-transformer';
import { SessionType } from '../../reference/models/session-type';

const version = 1
const room = { id: 'roomId', name: 'room', roomTypeCode: 'some-room-type-code' }
const person = { id: 'personId', name: 'person' }
let session: SessionViewModel = {
    id: 'id',
    start: moment(),
    duration: 60,
    room: room,
    person: person,
    sessionType: { code: 'session-type-code', description: 'session-type-description' } as SessionType,
    hearingParts: [],
    jurisdiction: '',
    version,
    allocated: moment.duration(0, 'minutes'),
    available: moment.duration(60, 'minutes'),
    utilization: 0,
    notes: []
};

let expectedEvent: SessionCalendarViewModel = {
    title: `${session.room.name} - ${session.person.name} - ${session.sessionType.description}`,
    startDate: session.start,
    start: session.start,
    end: moment(moment(session.start).add(moment.duration(session.duration))),
    id: session.id,
    hearingParts: session.hearingParts,
    sessionType: session.sessionType,
    room: room,
    person: person,
    version,
    duration: moment.duration(session.duration)
};

let sessionWithoutJudgeAndRoomAndSessionType = {
    ...session,
    person: undefined,
    room: undefined,
    sessionType: undefined,
} as SessionViewModel;

let expectedEventWithoutJudgeAndRoomAndSessionType = {
    ...expectedEvent,
    title: `No Room - No Judge - No Session type`,
    sessionType: undefined,
    room: undefined,
    person: undefined
}

let tests = [
    {
        name: 'with all fields defined',
        session: session,
        expectedEvent: expectedEvent
    }, {
        name: 'without judge, room and Session type',
        session: sessionWithoutJudgeAndRoomAndSessionType,
        expectedEvent: expectedEventWithoutJudgeAndRoomAndSessionType
    }
];

describe('DefaultDataTransformer', () => {

    let dataTransformer: IcalendarTransformer<SessionViewModel, SessionCalendarViewModel>;

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
