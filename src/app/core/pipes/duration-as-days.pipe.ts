import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({name: 'appDurationAsDays'})
export class DurationAsDaysPipe implements PipeTransform {
    transform(duration: moment.Duration) {
        if (!duration) {
            return undefined;
        }
        return moment.duration(duration).asDays();
    }
}
