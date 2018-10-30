import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({name: 'appDurationAsDays'})
export class DurationAsDaysPipe implements PipeTransform {
    transform(duration: moment.Duration) {
        if (!duration) {
            return undefined;
        }
        return this.ceilToFirstHalf(moment.duration(duration).asDays());
    }

    private ceilToFirstHalf(value) {
        if (value < 1) {
            return 1;
        }
        const precision = 10000;
        const roundedValue = Math.round(value * precision) / precision;
        const modulo = (roundedValue * precision) % precision;
        if (modulo >= 1) {
            return Math.floor(roundedValue) + 0.5;
        } else {
            return Math.floor(roundedValue);
        }
    }
}
