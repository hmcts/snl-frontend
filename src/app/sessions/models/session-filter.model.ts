
export interface SessionFilters {
    caseTypes: string[];
    rooms: string[];
    judges: string[];
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
