import { Validator, Validable, ValidationResult, ValidationError } from './validator';
let hasValidatorABeenCalled: boolean;
let hasValidatorBBeenCalled: boolean;
let validationResult: ValidationResult
const mockValidationMsg = 'some msg'
const mockError: ValidationError = { mockError: {humanReadableMsg: mockValidationMsg}}
const validatorA: Validable<boolean> = (obj: boolean) => { hasValidatorABeenCalled = obj; return null }

describe('Validator', () => {
    beforeEach(() => {
        hasValidatorABeenCalled = false;
        hasValidatorBBeenCalled = false;
    })
    describe('when some validator return not null', () => {
        beforeEach(() => {
            const validatorB: Validable<boolean> = (obj: boolean) => { hasValidatorBBeenCalled = obj; return mockError }
            const validator = new Validator([validatorA, validatorB])
            validationResult = validator.validate(true);
        })

        it('should execute all validators', () => {
            expect(hasValidatorABeenCalled).toEqual(true)
            expect(hasValidatorBBeenCalled).toEqual(true)
        });

        it('should set success flag to false', () => {
            expect(validationResult.success).toEqual(false)
        });

        it('should set errors', () => {
            expect(validationResult.errors).toEqual([mockError])
        });

        describe('getHumanReadableMsg', () => {
            it('should return concatenated error msg', () => {
                expect(validationResult.getHumanReadableMsg()).toEqual(mockValidationMsg)
            });
        });
    });
    describe('when all validator return null', () => {
        beforeEach(() => {
            const validatorB: Validable<boolean> = (obj: boolean) => { hasValidatorBBeenCalled = obj; return null }
            const validator = new Validator([validatorA, validatorB])
            validationResult = validator.validate(true);
        })

        it('should execute all validators', () => {
            expect(hasValidatorABeenCalled).toEqual(true)
            expect(hasValidatorBBeenCalled).toEqual(true)
        });

        it('should set success flag to true', () => {
            expect(validationResult.success).toEqual(true)
        });

        it('errors should be empty', () => {
            expect(validationResult.errors).toEqual([])
        });

        describe('getHumanReadableMsg', () => {
            it('should return null', () => {
                expect(validationResult.getHumanReadableMsg()).toEqual(null)
            });
        });
    });
});
