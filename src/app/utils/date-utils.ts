import * as moment from 'moment'
import { DurationAsDaysPipe } from '../core/pipes/duration-as-days.pipe';

export function isDateRangeValid(start: moment.Moment, end: moment.Moment): boolean {
    return (
           (start === null && end !== null)
        || (start !== null && end === null)
        || (start !== null
            && end !== null
            && start <= end)
    );
}

export function getHttpFriendly(date: moment.Moment): string {
    return date.format('DD-MM-YYYY');
}

export function formatDuration(duration: moment.Duration): string {
    duration = moment.duration(duration);
    const durationMs = duration.asMilliseconds();
    const durationOfOneDayInMs = 86400000;
    if (durationMs >= durationOfOneDayInMs) {
        const daysNumber = new DurationAsDaysPipe().transform(duration);
        return daysNumber + ' D';
    } else {
        return moment.utc(durationMs).format('HH:mm');
    }
}

export function formatDateTimeToHHmm(dateTime: moment.Moment): string {
    return moment(dateTime).format('HH:mm');
}

export function formatDateToDDmmYYYY(date: moment.Moment): string {
    return moment(date).format('DD/MM/YYYY');
}
