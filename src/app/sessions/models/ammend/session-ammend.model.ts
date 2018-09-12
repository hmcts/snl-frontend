import * as moment from 'moment';

export interface SessionAmmend {
    id: string;
    userTransactionId: string,
    durationInMinutes: number;
    start: moment.Moment;
    sessionTypeCode: string;
}
