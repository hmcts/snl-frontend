import { SearchCriteriaService } from './search-criteria.service';
import { HearingsFilters } from '../models/hearings-filter.model';

let service: SearchCriteriaService;
let filters: HearingsFilters;

describe('SearchCriteriaService', () => {
    beforeEach(() => {
        service = new SearchCriteriaService();

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
        it('should build searchcriteria array', () => {
            let customFilters = {
                ...filters,
                caseTypes: ['a']
            };

            expect(service.toSearchCriteria(customFilters)).toEqual([
                {key: 'caseType', operation: 'in', value: ['a']},
                {key: 'listingStatus', operation: 'equals', value: 'all'}
            ]);
        });
    });
});
