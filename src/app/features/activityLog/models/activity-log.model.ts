import * as moment from 'moment';

export interface ActivityLog {
    activityStatus: string,
    description: string,
    createdBy: string,
    createdAt: moment.Moment;
}
