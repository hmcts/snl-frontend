import { HearingsFilters } from '../models/hearings-filter.model';
import { HearingPartViewModel } from '../models/hearing-part.viewmodel';
import { Injectable } from '@angular/core';

@Injectable()
export class HearingsFilterService {

    constructor() {
    }

    filterByCaseType(h: HearingPartViewModel, filters: HearingsFilters) {
        return filters.caseTypes.length === 0 ? true : filters.caseTypes.includes(h.caseType.code);
    }

    filterByHearingType(h: HearingPartViewModel, filters: HearingsFilters) {
        return filters.hearingTypes.length === 0 ? true : filters.hearingTypes.includes(h.hearingType.code);
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

    filterUnlistedHearingParts(data: HearingPartViewModel[]): HearingPartViewModel[] {
        return data.filter(h => {
            return h.sessionId === undefined || h.sessionId === '' || h.sessionId === null
        });
    }
}
