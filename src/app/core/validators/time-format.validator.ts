import { AbstractControl } from '@angular/forms/src/model';
import { ValidationErrors } from '@angular/forms/src/directives/validators';
/**
 * Provides validator for time format (hh:mm).
 */
export class TimeFormatValidator {
    static pattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    static validate(control: AbstractControl): ValidationErrors | null {
        console.log('time validator');
        if (TimeFormatValidator.pattern.test(control.value)) {
            console.log('time valid');
            return null;
        }
        console.log('time INvalid');
        return {error: 'Wrong format'};
    }
}
