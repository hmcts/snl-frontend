import 'rxjs/add/observable/of';
import { InMemoryStorageService } from './in-memory-storage.service';

let key: string;
let value: string;

describe('InMemoryStorageService', () => {
    let service: InMemoryStorageService;

    beforeEach(() => {
        service = new InMemoryStorageService();

        key = 'key';
        value = 'val';
    });

    describe('When setting the value', () => {
        it('The value can be got', () => {
            service.setObject(key, value);

            expect(service.getObject(key)).toEqual(value);
        });
    });

    describe('When overriding the value', () => {
        it('The new value is returned', () => {
            let newValue = 'newValue';

            service.setObject(key, value);
            service.setObject(key, newValue);

            expect(service.getObject(key)).toEqual(newValue);
        });
    });

    describe('When no value exists', () => {
        it('The undefined is returned', () => {
            key = 'I DONT EXIST';

            service.getObject(key);

            expect(service.getObject(key)).toEqual(undefined);
        });
    });
});
