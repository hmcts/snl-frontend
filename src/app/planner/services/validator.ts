export interface ValidationError {
    [key: string]: { humanReadableMsg: string }
}

export interface Validable<T> {
    (obj: T): ValidationError | null
}

export class ValidationResult {
    get success(): boolean {
        return this.errors.length < 1;
    }

    readonly errors: ValidationError[] = []

    public getHumanReadableMsg(): string | null {
        if (this.success) {
            return null;
        }

        return this.errors.map(err => Object.values(err).map(er => er.humanReadableMsg)).join('\n');
    }
}

export class Validator<T> {
    constructor(private readonly validators: Validable<T>[] = []) { }

    public validate(data: T): ValidationResult {
        const validationResult = new ValidationResult()

        for (let i = 0; i < this.validators.length; i++) {
            const error = this.validators[i](data)
            if (error !== null) {
                validationResult.errors.push(error)
            }
        }

        return validationResult
    }
}
