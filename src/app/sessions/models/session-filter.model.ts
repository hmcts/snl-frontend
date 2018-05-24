
export interface SessionFilters {
    caseTypes: String[];
    rooms: String[];
    judges: String[];
    startDate: Date;
    endDate: Date;
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
