import { DatePipe } from '@angular/common';

export function isDateRangeValid(start: Date, end: Date): boolean {
    return (
           (start === null && end !== null)
        || (start !== null && end === null)
        || (start !== null
            && end !== null
            && start.getDate() <= end.getDate())
    );
}

export function getHttpFriendly(date) {
    return new DatePipe('en-UK').transform(date, 'dd-MM-yyyy');
}
