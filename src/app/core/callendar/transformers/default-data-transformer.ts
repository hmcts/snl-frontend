import { SessionViewModel, SessionCalendarViewModel } from '../../../sessions/models/session.viewmodel';
import { IcalendarTransformer } from './icalendar-transformer';
import * as moment from 'moment';

export class DefaultDataTransformer implements IcalendarTransformer<SessionViewModel, SessionCalendarViewModel> {

    constructor() {}

    transform(session: SessionViewModel): SessionCalendarViewModel {
        const judgeName = (session.person) ? session.person.name : 'No Judge';
        const roomName = (session.room) ? session.room.name : 'No Room';
        const sessionType = (session.sessionType) ? session.sessionType.description : 'No Session type';

        return {
            person: session.person,
            room: session.room,
            title: `${roomName} - ${judgeName} - ${sessionType}`,
            // used be validators
            startDate: session.start,
            // start & end dates are required by fullcalendar
            start: moment(session.start),
            end: moment(moment(session.start).add(moment.duration(session.duration))),
            id: session.id,
            hearingParts: session.hearingParts,
            sessionType: session.sessionType,
            version: session.version,
            duration: moment.duration(session.duration)
        };
    }
}
