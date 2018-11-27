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

export const DEFAULT_SESSION_FILTERS: SessionFilters = {
    sessionTypes: [],
    rooms: [],
    judges: [],
    startDate: moment().startOf('day'),
    endDate: moment().add(3, 'months').endOf('day'),
    utilization: {
        unlisted: {
            active: false,
            from: 0,
            to: 0
        },
        partListed: {
            active: false,
            from: 1,
            to: 99
        },
        fullyListed: {
            active: false,
            from: 100,
            to: 100
        },
        overListed: {
            active: false,
            from: 101,
            to: Infinity
        },
        custom: {
            active: false,
            from: 0,
            to: 0
        }
    }
}