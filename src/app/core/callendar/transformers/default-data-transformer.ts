import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import { IcalendarTransformer } from './icalendar-transformer';
import * as moment from 'moment';
import { EventsColorsForCasetype } from '../model/events-colors-for-casetype';

export class DefaultDataTransformer  implements IcalendarTransformer<SessionViewModel> {

    constructor() {}

    transform(session: SessionViewModel) {
        if (session.id === undefined) {
            return session;
        }
        const judgeName = (session.person) ? session.person.name : 'No Judge';
        const roomName = (session.room) ? session.room.name : 'No Room';
        const caseType = (session.caseType) ? session.caseType : 'No Case type';

        return {
            title: `${roomName} - ${judgeName} - ${caseType}`,
            start: moment(session.start),
            end: moment(moment(session.start).add(moment.duration(session.duration))),
            id: session.id,
            hearingParts: session.hearingParts,
            color: EventsColorsForCasetype[caseType] || 'gray'
        };
    }

}
