import * as moment from 'moment';

export interface CreateSessionForm {
    startDate: moment.Moment,
    startTime: string,
    durationInMinutes: number,
    sessionTypeCode: string,
    caseType: string,
    roomId: string,
    personId: string
}
