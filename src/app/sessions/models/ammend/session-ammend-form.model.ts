import * as moment from 'moment';

export interface SessionAmmendForm {
    id: string,
    startDate: moment.Moment,
    startTime: string,
    durationInMinutes: number,
    sessionTypeCode: string,
    roomName: string,
    roomTypeDescription: string,
    personName: string,
    hearingPartCount: number,
    version: number,
    multiSession: boolean,
    hasListedHearingParts: boolean,
}
