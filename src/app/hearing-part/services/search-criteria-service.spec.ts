import { SearchCriteriaService } from './search-criteria.service';
import { DEFAULT_HEARING_FILTERS, HearingsFilters } from '../models/hearings-filter.model';
import { ListingStatus } from '../models/listing-status-model';

let service: SearchCriteriaService;
let filters: HearingsFilters;

describe('SearchCriteriaService', () => {
    beforeEach(() => {
        service = new SearchCriteriaService();

        filters = DEFAULT_HEARING_FILTERS;
    });

    describe('When creating search criteria', () => {
        it('with empty arrays or empty string values criteria should be empty array', () => {
            expect(service.toSearchCriteria(filters)).toEqual([]);
        });

        it('should build searchcriteria array', () => {
            let customFilters = {
                ...filters,
                caseTypes: ['a']
            };

            expect(service.toSearchCriteria(customFilters)).toEqual([
                {key: 'caseType', operation: 'in', value: ['a']},
            ]);
        });

        it('with reservedJudgeId as "" then action is "in or null"', () => {
            let customFilters = {
                ...filters,
                judges: ['', 'b']
            };

            expect(service.toSearchCriteria(customFilters)).toEqual([
                {key: 'reservedJudgeId', operation: 'in or null', value: ['b']},
            ]);
        });

        it('with listingStatus as "Unlisted" then "listingStatus" criteria appears', () => {
            let customFilters = {
                ...filters,
                listingStatus: ListingStatus.Unlisted
            };

            expect(service.toSearchCriteria(customFilters)).toEqual([
                {key: 'listingStatus', operation: 'equals', value: ListingStatus.Unlisted},
            ]);
        });
    });
});
