import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment'

export class SessionAmendValidator {
    static isSameOrBefore(startTime: string): ValidatorFn {
        const hoursAndMinutesFormat = 'HH:mm'
        const initialStartTime = moment(startTime, hoursAndMinutesFormat);

        return (control: AbstractControl): {[key: string]: any} => {
            const changedStartTime = moment(control.value, hoursAndMinutesFormat)

            if (!changedStartTime.isSameOrBefore(initialStartTime)) {
                return { extendedStartTime: `Time should be before ${initialStartTime.format(hoursAndMinutesFormat)}` }
            }

            return null;
        }
    }
}
