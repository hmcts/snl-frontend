import { AbstractControl } from '@angular/forms/src/model';
import { ValidationErrors } from '@angular/forms/src/directives/validators';

/**
 * Provides validator for date format (dd/mm/yyyy).
 */
export class DateFormatValidator {

    static pattern = /^\d{2}\/\d{2}\/\d{4}$/;

    static validate(control: AbstractControl): ValidationErrors | null {

        const d = control.value;
        const date = (typeof d._i === 'object') ? this.formatDate(d._i) : d._i;

        if (DateFormatValidator.pattern.test(date)) {
            return null;
        }

        return { error: 'wrong format' };
    }

    private static formatDate(dateObj): string {
        return `${dateObj.date}/${dateObj.month}/${dateObj.year}`;
    }
}
