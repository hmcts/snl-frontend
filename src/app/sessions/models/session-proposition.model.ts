import * as moment from 'moment';

export interface SessionProposition {
    start: moment.Moment,
    end: moment.Moment,
    judgeId: string,
    roomId: string,
}
