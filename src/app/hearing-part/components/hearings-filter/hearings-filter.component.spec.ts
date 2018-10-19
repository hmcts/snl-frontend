import { HearingsFilterComponent } from './hearings-filter.component';
import { DEFAULT_HEARING_FILTERS, HearingsFilters } from '../../models/hearings-filter.model';

let component: HearingsFilterComponent;

describe('HearingsFilterComponent', () => {
    beforeEach(() => {
        component = new HearingsFilterComponent();
    });

    describe('When created', () => {
        it('the initial variables are set', () => {
            expect(component.communicationFacilitators).toBeDefined()
            expect(component.priorities).toBeDefined()
        });
    });

    describe('When filter', () => {
        it('the filter emitter should be called with proper parameters', () => {
            const filters: HearingsFilters = DEFAULT_HEARING_FILTERS;
            const filterEmit = spyOn(component.onFilter, 'emit');

            component.filters = filters;
            component.sendFilter();

            expect(filterEmit).toHaveBeenCalledWith(filters);
        });
    });
});
