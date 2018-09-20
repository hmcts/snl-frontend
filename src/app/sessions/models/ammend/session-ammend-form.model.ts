import * as moment from 'moment';

export interface SessionAmmendForm {
    startDate: moment.Moment,
    startTime: string,
    durationInMinutes: number,
    sessionTypeCode: string,
}
