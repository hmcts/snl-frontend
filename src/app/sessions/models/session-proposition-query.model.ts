import * as moment from 'moment'

export interface SessionPropositionQuery {
    from: moment.Moment;
    to: moment.Moment;
    durationInMinutes: number;
    roomId: string;
    judgeId: string;
}
