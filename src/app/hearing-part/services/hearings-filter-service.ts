import { HearingsFilters } from '../models/hearings-filter.model';
import { Injectable } from '@angular/core';
import { HearingViewmodel } from '../models/hearing.viewmodel';

@Injectable()
export class HearingsFilterService {

    // TODO missing spec file, also for session-filter
    constructor() {
    }

    filterByCaseType(h: HearingViewmodel, filters: HearingsFilters) {
        return filters.caseTypes.length === 0 ? true : filters.caseTypes.includes(h.caseType.code);
    }

    filterByHearingType(h: HearingViewmodel, filters: HearingsFilters) {
        return filters.hearingTypes.length === 0 ? true : filters.hearingTypes.includes(h.hearingType.code);
    }

    filterByPropertyContains(searchIn: string, searchFor: string, allowNull = true) {
        if (allowNull && (searchFor == null || searchFor === undefined || searchFor.trim() === '')) {
            return true;
        }
        if (searchFor && searchIn) {
            if (searchIn.search(searchFor) > -1) {
                return true;
            }
        } else {
            return false;
        }
    }

    filterByPropertyContainsAll(searchIn: string, searchForArray: string[]) {
        if (searchForArray.length === 0) {
            return true;
        }
        for (let searchFor of searchForArray) {
            if (this.filterByPropertyContains(searchIn, searchFor, true)) {
                return true;
            }
        }
        return false;
    }

    filterByProperty(property, filters) {
        if (filters.length === 0) {
            return true;
        }

        if (property) {
            return filters.includes(property.id);
        }

        return filters.includes('');
    }

}
