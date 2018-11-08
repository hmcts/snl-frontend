import { fromString, Status } from './status.model';

describe('StatusModel', () => {
    describe('fromString', () => {
        it('should parse status as enum', () => {
            expect(fromString('Listed')).toEqual(Status.Listed);
        });

        it('should throw error when value does not exist', () => {
            expect((() => fromString('NON EXISTENT ENUM VALUE'))).toThrowError();
        });
    });
});
