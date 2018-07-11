import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class SessionsStatisticsService {

    calculateAllocatedHearingsDuration(session) {
        let allocated = moment.duration();
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
        const available = reservedDuration.asMinutes() - allocatedDuration.asMinutes();
        return available > 0 ? available : 0;
    }

    constructor() {
    }
}
