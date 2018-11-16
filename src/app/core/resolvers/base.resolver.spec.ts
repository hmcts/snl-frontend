import { BaseResolver } from './base.resolver';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('BaseResolver', () => {
    let resolver: BaseResolver;

    beforeEach(() => {
        resolver = new BaseResolver();
    });

    describe('When the "getting" function returns zero-length array', () => {
        it('The "fetching" function returns new data', (done) => {
            let fetchedArray = ['Fetched'];
            let dataFetchingFunction = jasmine.createSpy('dataFetchingFunction').and.callFake(() => {
                return  Observable.of(fetchedArray);
            });

            let dataGettingFunction = jasmine.createSpy('dataGettingFunction').and.callFake(() => {
                return Observable.of([]);
            });

            resolver.getOrFetchData(() => dataFetchingFunction(), () =>  dataGettingFunction()).subscribe(data => {
                expect(dataFetchingFunction).toHaveBeenCalled();
                expect(dataGettingFunction).toHaveBeenCalled();
                expect(data).toEqual(fetchedArray);
                done();
            });
        });
    });

    describe('When the "getting" function returns  non-zero-length array', () => {
        it('The "fetching" function should not be called and current data should be returned', (done) => {
            let fetchedArray = ['Fetched'];
            let getArray = ['Get'];
            let dataFetchingFunction = jasmine.createSpy('dataFetchingFunction').and.callFake(() => {
                return  Observable.of(fetchedArray);
            });

            let dataGettingFunction = jasmine.createSpy('dataGettingFunction').and.callFake(() => {
                return Observable.of(getArray);
            });

            resolver.getOrFetchData(() => dataFetchingFunction(), () =>  dataGettingFunction()).subscribe(data => {
                expect(dataFetchingFunction).not.toHaveBeenCalled();
                expect(dataGettingFunction).toHaveBeenCalled();
                expect(data).toEqual(getArray);
                done();
            });
        });
    });
});
