import { DateFormatValidator } from './date-format.validator';
import { AbstractControl } from '@angular/forms';

describe('DateFormatValidator.validate', () => {

    describe('should return null when', () => {

        it('valid date string given', () => {
            expect(validate('12/12/2000')).toBeNull();
        });

        it('valid date object given', () => {
            expect(validate({ date: 12, month: 11, year: 2000})).toBeNull();
        });

        it('one-digit values given', () => {
            expect(validate({ date: 8, month: 1, year: 2000})).toBeNull();
        });

    });

    describe('should return error for', () => {

        describe('invalid string date when', function () {

            it('empty string given', () => {
                expect(validate('')).not.toBeNull();
            });

            it('letters given', () => {
                expect(validate('abc')).not.toBeNull();
            });

            it('one-digit for day given', () => {
                expect(validate('1/10/2010')).not.toBeNull();
            });

            it('one-digit for month given', () => {
                expect(validate('01/1/2010')).not.toBeNull();
            });

            it('less than 4 digits for year given', () => {
                expect(validate('01/11/201')).not.toBeNull();
                expect(validate('01/11/20')).not.toBeNull();
                expect(validate('01/11/2')).not.toBeNull();
            });

            it('more than 4 digits for year given', () => {
                expect(validate('01/11/12345')).not.toBeNull();
            });

            it('dashes used instead of slashes given', () => {
                expect(validate('01-11-2000')).not.toBeNull();
            });

            it('dots used instead of slashes given', () => {
                expect(validate('01.11.2000')).not.toBeNull();
            });

            it('white spaces used instead of slashes given', () => {
                expect(validate('01 11 2000')).not.toBeNull();
            });
        });

        describe('invalid date object when', function () {

            it('letters given', () => {
                expect(validate({ date: 'abc', month: 1, year: 2010})).not.toBeNull();
            });
        });

        fit('null given', () => {
            expect(DateFormatValidator.validate({ value: null  } as AbstractControl)).not.toBeNull();
        });
    });
});

function validate(date) {
    return DateFormatValidator.validate({ value: { _i: date }  } as AbstractControl);
}
