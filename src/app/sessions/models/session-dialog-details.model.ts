import { SessionViewModel } from './session.viewmodel';
import * as moment from 'moment';
import { SessionsStatisticsService } from '../services/sessions-statistics-service';

export class SessionDialogDetails {
    private sessionsStatsService: SessionsStatisticsService;

    constructor(public session: SessionViewModel) {
        this.sessionsStatsService = new SessionsStatisticsService();
    }

    public getTime() {
        return moment(this.session.start).format('HH:mm');
    }

    public getEndTime() {
        return moment(this.session.start).add(moment.duration(this.session.duration)).format('HH:mm');
    }

    public getAllocatedHearingsDuration() {
        return this.sessionsStatsService.calculateAllocatedHearingsDuration(this.session);
    }

    public getAvailableDuration() {
        return this.sessionsStatsService.calculateAvailableDuration(moment.duration(this.session.duration),
            this.getAllocatedHearingsDuration());
    }
}
