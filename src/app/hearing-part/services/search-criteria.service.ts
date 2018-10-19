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
            {key: 'listingStatus', operation: 'equals', value: filters.listingDetails},
        ].filter(this.isValueAnEmptyString)
         .filter(this.isValueAnEmptyArray);

        let reservedJudgesCriterion = criteria.find(criterion => criterion.key === 'reservedJudgeId')
        if (reservedJudgesCriterion !== undefined && reservedJudgesCriterion.value.includes('')) {
            reservedJudgesCriterion.operation = 'in or null'
            reservedJudgesCriterion.value = (reservedJudgesCriterion.value as string[]).filter(v => v !== '')
        }
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
