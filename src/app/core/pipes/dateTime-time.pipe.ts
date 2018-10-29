import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';
import { formatStartTime } from '../../utils/date-utils';

@Pipe({ name: 'appDateTimeToTime' })
export class DateTimeToTime implements PipeTransform {
    transform(duration: moment.Moment) {
        return formatStartTime(duration);
    }
}
