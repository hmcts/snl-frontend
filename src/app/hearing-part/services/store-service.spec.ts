import { StoreService } from './store-service';

let store: any;
let service: StoreService;

describe('StoreService', () => {
    beforeEach(() => {
        store = jasmine.createSpyObj('store', ['dispatch', 'pipe']);
        service = new StoreService(store);
    });

    describe('Getting', () => {
        it('full hearings calls Store', () => {
            service.getFullHearings$();

            expect(store.pipe).toHaveBeenCalled();
        });

        it('case types calls Store', () => {
            service.getCaseTypes$();

            expect(store.pipe).toHaveBeenCalled();
        });

        it('judges calls Store', () => {
            service.getJudges$();

            expect(store.pipe).toHaveBeenCalled();
        });

        it('hearing types calls Store', () => {
            service.getHearingTypes$();

            expect(store.pipe).toHaveBeenCalled();
        });

        it('case types calls Store', () => {
            service.getFullHearings$();

            expect(store.pipe).toHaveBeenCalled();
        });
    });
});
