import { AbstractControl } from '@angular/forms/src/model';
import { ValidationErrors } from '@angular/forms/src/directives/validators';
/**
 * Provides validator for time format (hh:mm).
 */
export class TimeFormatValidator {
    static pattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    static validate(control: AbstractControl): ValidationErrors | null {
        if (TimeFormatValidator.pattern.test(control.value)) {
            return null;
        }
        return {error: 'Wrong format'};
    }
}
