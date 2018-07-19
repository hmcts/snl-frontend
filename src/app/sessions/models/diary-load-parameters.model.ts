import * as moment from 'moment';
export interface DiaryLoadParameters {
    judgeUsername: string,
    startDate: moment.Moment,
    endDate: moment.Moment
}
