import { HearingsFilters } from '../models/hearings-filter.model';
import { Injectable } from '@angular/core';
import { SearchCriteria } from '../models/search-criteria';

@Injectable()
export class SearchCriteriaService {

    constructor() {
    }

    toSearchCriteria(filters: HearingsFilters): SearchCriteria[] {
        let criteria = [
            {key: 'caseNumber', operation: 'equals', value: filters.caseNumber},
            {key: 'caseTitle', operation: 'like', value: filters.caseTitle},
            {key: 'priority', operation: 'in', value: filters.priorities},
            {key: 'caseType', operation: 'in', value: filters.caseTypes},
            {key: 'hearingType', operation: 'in', value: filters.hearingTypes},
            {key: 'communicationFacilitator', operation: 'in', value: filters.communicationFacilitators},
            {key: 'reservedJudgeId', operation: 'in', value: filters.judges},
            {key: 'listingDetails', operation: 'listingStatus', value: filters.listingDetails},
        ].filter(this.isValueAnEmptyString)
         .filter(this.isValueAnEmptyArray);

        return criteria;
    }

    private isValueAnEmptyString(c: SearchCriteria): boolean {
        return c.value !== ''
    }

    private isValueAnEmptyArray(c: SearchCriteria): boolean {
        return (c.operation !== 'in') ||
            ((c.operation === 'in') && (c.value.length !== 0))
    }

}
