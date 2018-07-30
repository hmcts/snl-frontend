import { SessionViewModel } from './session.viewmodel';
import * as moment from 'moment';
import { SessionsStatisticsService } from '../services/sessions-statistics-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class SessionDialogDetails {
    private readonly sessionsStatsService: SessionsStatisticsService;

    public time: Observable<string>;
    public endTime: Observable<string>;
    public allocatedHearingsDuration: Observable<moment.Duration>;
    public availableDuration: Observable<number>;

    constructor(public session: Observable<SessionViewModel>) {
        this.sessionsStatsService = new SessionsStatisticsService();

        this.time = this.session.pipe(map(s => this.getTime(s.start)));
        this.endTime = this.session.pipe(map(s => this.getEndTime(s.start, s.duration)));
        this.allocatedHearingsDuration = this.session.pipe(map(s => this.getAllocatedHearingsDuration(s)));
        this.availableDuration = this.session.pipe(map(s => this.getAvailableDuration(s)));
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
        return this.sessionsStatsService.calculateAvailableDuration(moment.duration(session.duration),
            this.getAllocatedHearingsDuration(session));
    }
}
