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
    return moment.utc(moment.duration(duration).asMilliseconds()).format('HH:mm');
}
