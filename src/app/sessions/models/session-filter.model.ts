import * as moment from 'moment'

export interface SessionFilters {
    sessionTypes: string[];
    rooms: string[];
    judges: string[];
    startDate: moment.Moment;
    endDate: moment.Moment;
    utilization: {
        unlisted: UtilizationFilter,
        partListed: UtilizationFilter,
        fullyListed: UtilizationFilter,
        overListed: UtilizationFilter,
        custom: UtilizationFilter
    };
}

export interface UtilizationFilter {
    active: boolean,
    from: number,
    to: number
}
