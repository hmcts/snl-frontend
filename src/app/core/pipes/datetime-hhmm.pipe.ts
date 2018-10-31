import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';
import { formatDateTimeToHHmm } from '../../utils/date-utils';

@Pipe({ name: 'appDateTimeToHHmm' })
export class DateTimeToHHmmPipe implements PipeTransform {
    transform(dateTime: moment.Moment) {
        return formatDateTimeToHHmm(dateTime);
    }
}
