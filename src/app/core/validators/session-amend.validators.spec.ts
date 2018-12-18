import { SessionAmendValidator } from './session-amend.validators';
import { AbstractControl } from '@angular/forms';

describe('SessionAmendValidator', () => {
    describe('isSameOrBefore', () => {
        describe('should return null', () => {
            it('when control time is before', () => {
                expect(isSameOrBefore('11:00', '10:59')).toBeNull()
            });
            it('when control time is the same', () => {
                expect(isSameOrBefore('11:00', '11:00')).toBeNull()
            });
        });

        describe('should return not null', () => {
            it('when control time is after', () => {
                expect(isSameOrBefore('11:00', '11:01')).not.toBeNull()
            });
        });
    });
});

function isSameOrBefore(initialStartTime: string, controlValue: string) {
    const control = {value: controlValue} as AbstractControl
    return SessionAmendValidator.isSameOrBefore(initialStartTime)(control)
}
