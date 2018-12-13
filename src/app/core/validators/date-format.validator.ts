import { AbstractControl } from '@angular/forms/src/model';
import { ValidationErrors } from '@angular/forms/src/directives/validators';
import { formatDateToDDmmYYYY } from '../../utils/date-utils';

/**
 * Provides validator for date format (dd/mm/yyyy).
 */
export class DateFormatValidator {

    static pattern = /^\d{2}\/\d{2}\/\d{4}$/;

    static validate(control: AbstractControl): ValidationErrors | null {

        const d = control.value;

        if (!d) {
            return { error: 'Wrong input - moment object expected' };
        }

        const date = (d && '') || (typeof d._i === 'object') ? formatDateToDDmmYYYY(d._i) : d._i;

        if (DateFormatValidator.isOnLoadCall(d) || DateFormatValidator.pattern.test(date)) {
            return null;
        }

        return { error: 'Wrong format' };
    }

    private static isOnLoadCall(date): boolean {
        return date._isAMomentObject && date._isValid && !date._i;
    }
}
