import * as moment from 'moment';

export interface SessionCreate {
    id: string;
    userTransactionId: string,
    personId: string;
    roomId: string;
    duration: number;
    start: moment.Moment;
    caseType: string
}
