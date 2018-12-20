import { AbstractControl } from '@angular/forms';
import { TimeFormatValidator } from './time-format.validator';

describe('TimeFormatValidator.validate', () => {

    describe('should return null when', () => {

        it('valid date string given', () => {
            expect(validate('10:50')).toBeNull();
        });

        it('leading zeros', () => {
            expect(validate('01:01')).toBeNull();
        });

        it('midnight', () => {
            expect(validate('00:00')).toBeNull();
        });

    });

    describe('should return error when', () => {

        it('empty string given', () => {
            expect(validate('')).not.toBeNull();
        });

        it('letters given', () => {
            expect(validate('abc')).not.toBeNull();
        });

        it('one-digit for hour given', () => {
            expect(validate('1:10')).not.toBeNull();
        });

        it('one-digit for minutes given', () => {
            expect(validate('10:1')).not.toBeNull();
        });

        it('more than 2 digits for hours given', () => {
            expect(validate('111:10')).not.toBeNull();
        });

        it('more than 2 digits for minutes given', () => {
            expect(validate('10:111')).not.toBeNull();
        });

        it('no colon given', () => {
            expect(validate('1023')).not.toBeNull();
        });

        it('white spaces used instead of colon given', () => {
            expect(validate('10 10')).not.toBeNull();
        });
    });
});

function validate(time) {
    return TimeFormatValidator.validate({ value: time  } as AbstractControl);
}
