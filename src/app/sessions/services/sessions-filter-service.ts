import { SessionViewModel } from '../models/session.viewmodel';
import { SessionFilters, UtilizationFilter } from '../models/session-filter.model';
import * as moment from 'moment';
import { HearingPartViewModel } from '../../hearing-part/models/hearing-part.viewmodel';
import { Injectable } from '@angular/core';
import { SessionsStatisticsService } from './sessions-statistics-service';

@Injectable()
export class SessionsFilterService {

    constructor(private readonly sessionsStatsService: SessionsStatisticsService) {
    }

    filterBySessionType(s: SessionViewModel, filters: SessionFilters) {
        return filters.sessionTypes.length === 0 ? true : filters.sessionTypes.includes(s.sessionType.code);
    }

    filterByUtilization(session: SessionViewModel, filters) {
        let matches = false;
        let anyFilterActive = false;
        Object.values(filters).forEach((filter: UtilizationFilter) => {
            if (filter.active) {
                anyFilterActive = true;
                const allocated = this.sessionsStatsService.calculateAllocatedHearingsDuration(session);
                const sessionUtilization = this.sessionsStatsService
                    .calculateUtilizedDuration(moment.duration(session.duration), allocated);
                if (sessionUtilization >= filter.from && sessionUtilization <= filter.to) {
                    matches = true;
                }
            }
        });

        return !anyFilterActive ? true : matches;
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
            return h.session === undefined || h.session === '' || h.session === null
        });
    }
}
