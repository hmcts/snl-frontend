import moment = require('moment');
import { v4 as uuid } from 'uuid';

export class SessionHelper {

    public static generateSessionCreateJson(start: moment.Moment, sessionTypeCode: string,
                                     personId: string = null, roomId: string = null) {
        return {
            id: uuid(),
            userTransactionId: uuid(),
            personId: personId,
            roomId: roomId,
            duration: 3600,
            start: start,
            sessionTypeCode: sessionTypeCode
        }
    }
}
