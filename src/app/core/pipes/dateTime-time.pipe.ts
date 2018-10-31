import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';
import { formatDateTimeToTime } from '../../utils/date-utils';

@Pipe({ name: 'appDateTimeToTime' })
export class DateTimeToTimePipe implements PipeTransform {
    transform(dateTime: moment.Moment) {
        return formatDateTimeToTime(dateTime);
    }
}
