import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({ name: 'appDurationAsMinutes' })
export class DurationAsMinutesPipe implements PipeTransform {
    transform(duration: moment.Duration) {
        return moment.duration(duration).asMinutes();
    }
}
