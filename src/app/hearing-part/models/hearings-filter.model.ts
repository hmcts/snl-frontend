import * as moment from 'moment'

// TODO SL-1551: make hearings alike
export interface HearingsFilters {
    caseTypes: string[];
    hearingTypes: string[];
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
