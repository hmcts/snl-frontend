import { HearingsFilters } from '../models/hearings-filter.model';
import { Injectable } from '@angular/core';
import { SearchCriteria } from '../models/search-criteria';
import { ListingStatus } from '../models/listing-status-model';

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
            {key: 'listingStatus', operation: 'equals', value: filters.listingStatus},
        ].filter(this.isValueAnEmptyString)
         .filter(this.isValueAnEmptyArray);

        let reservedJudgesCriterion = criteria.find(criterion => criterion.key === 'reservedJudgeId')
        if (reservedJudgesCriterion !== undefined && reservedJudgesCriterion.value.includes('')) {
            reservedJudgesCriterion.operation = 'in or null';
            reservedJudgesCriterion.value = (reservedJudgesCriterion.value as string[]).filter(v => v !== '')
        }

        criteria = this.removeListingStatusCriterionIfSetToAll(criteria);

        return criteria;
    }

    private removeListingStatusCriterionIfSetToAll(criteria: SearchCriteria[]): SearchCriteria[] {
        let listingStatusCriterion = criteria.find(criterion => criterion.key === 'listingStatus')
        if (listingStatusCriterion !== undefined && listingStatusCriterion.value === ListingStatus.All) {
            let listingStatusCriterionIndex = criteria.map(c => c.key).indexOf('listingStatus');
            criteria.splice(listingStatusCriterionIndex, 1);
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
