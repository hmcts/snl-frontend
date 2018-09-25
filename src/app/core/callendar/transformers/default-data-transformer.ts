import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import { IcalendarTransformer } from './icalendar-transformer';
import * as moment from 'moment';

export class DefaultDataTransformer implements IcalendarTransformer<SessionViewModel> {

    constructor() {}

    transform(session: SessionViewModel) {
        if (session.id === undefined) {
            return session;
        }
        const judgeName = (session.person) ? session.person.name : 'No Judge';
        const roomName = (session.room) ? session.room.name : 'No Room';
        const sessionType = (session.sessionType) ? session.sessionType.description : 'No Session type';

        return {
            person: session.person,
            room: session.room,
            title: `${roomName} - ${judgeName} - ${sessionType}`,
            start: moment(session.start),
            end: moment(moment(session.start).add(moment.duration(session.duration))),
            id: session.id,
            hearingParts: session.hearingParts,
            color: 'gray'
        };
    }

}
