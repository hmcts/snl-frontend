import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import { IcalendarTransformer } from './icalendar-transformer';
import * as moment from 'moment';

export class DefaultDataTransformer  implements IcalendarTransformer<SessionViewModel> {

    constructor() {}

    transform(session: SessionViewModel) {
        let judgeName = (session.person) ? session.person.name : 'No Judge';
        let roomName = (session.room) ? session.room.name : 'No Room';
        let caseType = (session.caseType) ? session.caseType : 'No Case type';

        return {
            title: roomName + ' - ' + judgeName + ' - ' + caseType,
            start: session.start,
            end: moment(session.start).add(moment.duration(session.duration)).toDate(),
            id: session.id,
            hearingParts: session.hearingParts
        };
    }

}
