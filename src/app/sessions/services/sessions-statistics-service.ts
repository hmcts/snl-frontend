import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { SessionViewModel } from '../models/session.viewmodel';

@Injectable()
export class SessionsStatisticsService {

    calculateAllocatedHearingsDuration(session: SessionViewModel): moment.Duration {
        let allocated = moment.duration(); // NOSONAR not const
        if (session.hearingParts !== undefined) {
            session.hearingParts.forEach(hearingPart => {
                if (hearingPart.multiSession) {
                    allocated.add(moment.duration(session.duration));
                } else {
                    allocated.add(moment.duration(hearingPart.duration));
                }
            });
        }

        return allocated;
    }

    calculateUtilizedDuration(reservedDuration: moment.Duration, allocatedDuration: moment.Duration) {
        return Math.ceil((allocatedDuration.asMinutes() / reservedDuration.asMinutes()) * 100);
    }

    calculateAvailableDuration(reservedDuration: moment.Duration, allocatedDuration: moment.Duration) {
        let availableDuration = reservedDuration.subtract(allocatedDuration);
        if (availableDuration.asMinutes() < 0) {
            return moment.duration('PT0M');
        }

        return availableDuration;
    }

    constructor() {
    }
}
