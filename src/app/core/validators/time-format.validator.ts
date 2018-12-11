import { AbstractControl } from '@angular/forms/src/model';
import { ValidationErrors } from '@angular/forms/src/directives/validators';

/**
 * Provides validator for time format.
 */
export class TimeFormatValidator {

    static validate(control: AbstractControl): ValidationErrors | null {
        return null;
    }
}
