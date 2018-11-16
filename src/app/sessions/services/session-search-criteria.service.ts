import { Injectable } from '@angular/core';
import { SessionFilters } from '../models/session-filter.model';
import { SearchCriteria } from '../../hearing-part/models/search-criteria';
import { SessionFilterKey } from '../models/session-search-column';

@Injectable()
export class SessionSearchCriteriaService {

    convertToSearchCriterions(sessionFilter: SessionFilters) {
        const searchCriterions = [
            this.createSearchCriteriaIfNotNull(SessionFilterKey.StartDate, sessionFilter.startDate),
            this.createSearchCriteriaIfNotNull(SessionFilterKey.EndDate , sessionFilter.endDate),
            this.createSearchCriteriaFromArray(SessionFilterKey.SessionTypesCodes, sessionFilter.sessionTypes),
            this.createSearchCriteriaFromArray(SessionFilterKey.PersonIds, sessionFilter.judges),
            this.createSearchCriteriaFromArray(SessionFilterKey.RoomIds, sessionFilter.rooms),
            this.createSearchCriteriaIfNotNull(SessionFilterKey.Unlisted, sessionFilter.utilization.unlisted.active),
            this.createSearchCriteriaIfNotNull(SessionFilterKey.PartListed, sessionFilter.utilization.partListed.active),
            this.createSearchCriteriaIfNotNull(SessionFilterKey.FullyListed, sessionFilter.utilization.fullyListed.active),
            this.createSearchCriteriaIfNotNull(SessionFilterKey.OverListed, sessionFilter.utilization.overListed.active),
        ]

        if (sessionFilter.utilization.custom.active) {
            if (sessionFilter.utilization.custom.from) {
                searchCriterions.push(
                    {key: SessionFilterKey.CustomFrom, operation: 'equals', value: sessionFilter.utilization.custom.from}
                )
            }

            if (sessionFilter.utilization.custom.to) {
                searchCriterions.push(
                    {key: SessionFilterKey.CustomTo, operation: 'equals', value: sessionFilter.utilization.custom.to}
                )
            }
        }

        return searchCriterions.filter(sc => sc !== null);
    }

    private createSearchCriteriaFromArray(key, values: string[]): SearchCriteria {
        if (values.length === 0) { return null; }

        const searchCriteria = {
            key,
            operation: 'in',
            value: values
        };

        if (values.includes('')) {
            searchCriteria.operation = 'in or null'
        }

        return searchCriteria
    }

    private createSearchCriteriaIfNotNull(key, value: any): SearchCriteria {
        if (value === undefined || value === false) { return null; }

        return {
            key,
            operation: 'equals',
            value
        }
    }
}
