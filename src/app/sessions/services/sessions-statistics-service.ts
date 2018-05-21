import { Injectable } from '@angular/core';
import { schema } from 'normalizr';
import * as moment from 'moment';

@Injectable()
export class SessionsStatisticsService {

    calculateAllocated(session) {
        let allocated = moment.duration();
        session.hearingParts.forEach(hearingPart => {
            allocated.add(moment.duration(hearingPart.duration));
        })
        return allocated;
    }

    calculateUtilized(duration: string, allocated: moment.Duration) {
        return Math.round((allocated.asMinutes() / moment.duration(duration).asMinutes()) * 100);
    }

    calculateAvailable(duration: string, allocated: moment.Duration) {
        let available = moment.duration(duration).asMinutes() - allocated.asMinutes();
        return available > 0 ? available : 0;
    }

    constructor() {
    }
}
