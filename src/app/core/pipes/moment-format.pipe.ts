import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({ name: 'appMomentFormat' })
export class MomentFormatPipe implements PipeTransform {
    transform(dateTime: moment.Moment, timeFormat: string) {
        return timeFormat !== undefined ? dateTime.format(timeFormat) : dateTime.format();
    }
}
