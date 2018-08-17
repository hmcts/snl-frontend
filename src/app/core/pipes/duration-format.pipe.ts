import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';
import { formatDuration } from '../../utils/date-utils';

@Pipe({ name: 'appDurationFormat' })
export class DurationFormatPipe implements PipeTransform {
    transform(duration: moment.Duration) {
        return formatDuration(duration);
    }
}
