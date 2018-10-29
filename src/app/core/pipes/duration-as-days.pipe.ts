import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({name: 'appDurationAsDays'})
export class DurationAsDaysPipe implements PipeTransform {
    transform(duration: moment.Duration) {
        if (!duration) {
            return undefined;
        }
        return this.ceilToFirstToHalf(moment.duration(duration).asDays());
    }

    private ceilToFirstToHalf(value) {
        const roundedValue = Math.round(value * 10) / 10;
        const modulo = (roundedValue * 10) % 10;
        if (modulo >= 1) {
            return Math.floor(roundedValue) + 0.5;
        } else {
            return Math.floor(roundedValue);
        }
    }
}
