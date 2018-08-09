import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class SessionsStatisticsService {

    calculateAllocatedHearingsDuration(session): moment.Duration {
        let allocated = moment.duration(); // NOSONAR not const
        if (session.hearingParts !== undefined) {
            session.hearingParts.forEach(hearingPart => {
                allocated.add(moment.duration(hearingPart.duration));
            });
        }
        return allocated;
    }

    calculateUtilizedDuration(reservedDuration: moment.Duration, allocatedDuration: moment.Duration) {
        return Math.ceil((allocatedDuration.asMinutes() / reservedDuration.asMinutes()) * 100);
    }

    calculateAvailableDuration(reservedDuration: moment.Duration, allocatedDuration: moment.Duration) {
        return reservedDuration.subtract(allocatedDuration);
    }

    constructor() {
    }
}
