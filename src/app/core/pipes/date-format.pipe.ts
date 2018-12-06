import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({ name: 'appDateTimeToDate' })
export class DateFormatPipe implements PipeTransform {
    transform(dateTime: moment.Moment) {
        return moment(dateTime).format();
    }
}
