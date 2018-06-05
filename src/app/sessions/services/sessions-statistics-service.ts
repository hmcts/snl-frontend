import { Injectable } from '@angular/core';
import { schema } from 'normalizr';
import * as moment from 'moment';

@Injectable()
export class SessionsStatisticsService {

    calculateAllocatedHearingsDuration(session) {
        let allocated = moment.duration();
        session.hearingParts.forEach(hearingPart => {
            allocated.add(moment.duration(hearingPart.duration));
        });
        return allocated;
    }

    calculateUtilizedDuration(reservedDuration: moment.Duration, allocatedDuration: moment.Duration) {
        return Math.round((allocatedDuration.asMinutes() / reservedDuration.asMinutes()) * 100);
    }

    calculateAvailableDuration(reservedDuration: moment.Duration, allocatedDuration: moment.Duration) {
        let available = reservedDuration.asMinutes() - allocatedDuration.asMinutes();
        return available > 0 ? available : 0;
    }

    constructor() {
    }
}