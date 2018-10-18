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
    if (durationMs >= 86400000) {
        const durationDays = Math.floor((durationMs / 86400000));
        const durationHours = (durationDays * 24) + duration.hours();
        return durationHours + ':' +
            (duration.minutes() < 10 ? '0' + duration.minutes() : duration.minutes());

    } else {
        return moment.utc(durationMs).format('HH:mm');
    }
}
