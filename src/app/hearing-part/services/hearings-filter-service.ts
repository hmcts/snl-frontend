import { HearingsFilters } from '../models/hearings-filter.model';
import { Injectable } from '@angular/core';
import { SearchCriteria } from '../models/search-criteria';

@Injectable()
export class HearingsFilterService {

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
        ].filter( entry => {
            return (entry.value !== '' || (Array.isArray(entry.value) && entry.value.length !== 0) );
        });

        criteria = criteria.filter(c => (c.operation !== 'in') ||
            ((c.operation === 'in') && (c.value.length !== 0)))

        return criteria;
    }

}
