import * as moment from 'moment';

export interface ActivityLog {
    activityStatus: string,
    description: string,
    createdBy: string,
    createdAt: moment.Moment;
}

export interface ActivityLogResponse {
    activityStatus: string,
    description: string,
    createdBy: string,
    createdAt: string;
}

export function mapResponseToActivityLog(activityLogResponse: ActivityLogResponse): ActivityLog {
    return {
        activityStatus: activityLogResponse.activityStatus,
        description: activityLogResponse. description,
        createdBy: activityLogResponse.createdBy,
        createdAt: moment(activityLogResponse.createdAt)
    }
}

export const DEFAULT_ACTIVITY_LOG: ActivityLog = {
    activityStatus: undefined,
    description: undefined,
    createdAt: undefined,
    createdBy: undefined
}
