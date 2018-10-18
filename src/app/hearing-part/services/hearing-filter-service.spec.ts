import { HearingsFilterService } from './hearings-filter-service';
import { HearingsFilters } from '../models/hearings-filter.model';

let service: HearingsFilterService;
let filters: HearingsFilters;

fdescribe('HearingFilterService', () => {
    beforeEach(() => {
        service = new HearingsFilterService();

        filters = {
            caseNumber: '',
            caseTitle: '',
            priorities: [],
            caseTypes: [],
            hearingTypes: [],
            communicationFacilitators: [],
            judges: [],
            listingDetails: 'all'
        } as HearingsFilters;
    });

    describe('toSearchCriteria', () => {
        it('should build proper url', () => {
            console.log(service.toSearchCriteria(filters));
        });
    });
});
