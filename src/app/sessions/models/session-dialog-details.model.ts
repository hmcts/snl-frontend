import { SessionViewModel } from './session.viewmodel';
import * as moment from 'moment';
import { SessionsStatisticsService } from '../services/sessions-statistics-service';
import { Observable } from 'rxjs/Observable';
import { formatDuration } from '../../utils/date-utils';

export class SessionDialogDetails {
    private readonly sessionsStatsService: SessionsStatisticsService;

    public time: Observable<string>;
    public endTime: Observable<string>;
    public allocatedHearingsDuration: Observable<string>;
    public availableDuration: Observable<string>;

    constructor(public session: Observable<SessionViewModel>) {
        this.sessionsStatsService = new SessionsStatisticsService();

        this.time = this.session.map(s => this.getTime(s.start));
        this.endTime = this.session.map(s => this.getEndTime(s.start, s.duration));
        this.allocatedHearingsDuration = this.session.map(s => formatDuration(this.getAllocatedHearingsDuration(s)));
        this.availableDuration = this.session.map(s => this.getAvailableDuration(s));
    }

    private getTime(time) {
        return moment(time).format('HH:mm');
    }

    private getEndTime(start, duration) {
        return moment(start).add(moment.duration(duration)).format('HH:mm');
    }

    private getAllocatedHearingsDuration(session) {
        return this.sessionsStatsService.calculateAllocatedHearingsDuration(session);
    }

    private getAvailableDuration(session) {
        let duration = this.sessionsStatsService.calculateAvailableDuration(moment.duration(session.duration),
            this.getAllocatedHearingsDuration(session));

        return formatDuration(duration);
    }
}
