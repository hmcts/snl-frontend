import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import * as moment from 'moment';
import { EventsColorsForCasetype } from '../model/events-colors-for-casetype';
import { DefaultDataTransformer } from './default-data-transformer';
import { IcalendarTransformer } from './icalendar-transformer';
import { CaseType } from '../../reference/models/case-type';

let session = {
    id: 'id',
    start: moment(),
    duration: 60,
    room: { name: 'room' },
    person: { name: 'person' },
    caseType: { code: 'SCLAIMS', description: 'SCLAIMS' } as CaseType,
    hearingParts: [],
    jurisdiction: ''
} as SessionViewModel;

let expectedEvent = {
    title: `${session.room.name} - ${session.person.name} - ${session.caseType.description}`,
    start: session.start,
    end: moment(moment(session.start).add(moment.duration(session.duration))),
    id: session.id,
    hearingParts: session.hearingParts,
    color: EventsColorsForCasetype[session.caseType.code]
};

let sessionWithoutJudgeAndRoomAndCasetype = {
    ...session,
    person: undefined,
    room: undefined,
    caseType: undefined,
} as SessionViewModel;

let expectedEventWithoutJudgeAndRoomAndCasetype = {
    ...expectedEvent,
    title: `No Room - No Judge - No Case type`,
    color: 'gray'
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
        name: 'without judge, room and casetype',
        session: sessionWithoutJudgeAndRoomAndCasetype,
        expectedEvent: expectedEventWithoutJudgeAndRoomAndCasetype
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
