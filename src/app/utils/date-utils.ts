import * as moment from 'moment'

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
    const durationMs = duration.asMilliseconds();
    const durationOfOneDayInMs = 86400000;
    if (durationMs >= durationOfOneDayInMs) {
        const durationDays = Math.floor((durationMs / durationOfOneDayInMs));
        const durationHours = (durationDays * 24) + duration.hours();
        return durationHours + ':' +
            (duration.minutes() < 10 ? '0' + duration.minutes() : duration.minutes());

    } else {
        return moment.utc(durationMs).format('HH:mm');
    }
}
