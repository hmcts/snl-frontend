import * as moment from 'moment';

export interface SessionAmmendForm {
    startDate: moment.Moment,
    startTime: string,
    durationInMinutes: number,
    sessionTypeCode: string,
    roomName: string,
    roomType: string,
    personName: string,
    hearingPartCount: number
}
