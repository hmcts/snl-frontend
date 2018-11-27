import { SearchCriteria } from './../../hearing-part/models/search-criteria';
import { SessionFilters } from '../models/session-filter.model';
import { SessionSearchCriteriaService } from './session-search-criteria.service';
import moment = require('moment');
import { SessionFilterKey } from '../models/session-filter-key';

const sessionSearchCriteriaService: SessionSearchCriteriaService =  new SessionSearchCriteriaService()
let sessionFilter: SessionFilters;

describe('SessionSearchCriteriaService', () => {
    beforeEach(() => {
        sessionFilter = defaultSessionFilter()
    })

    describe('when filters are emtpy', () => {
        it('should return an empty array', () => {
            expect(
                sessionSearchCriteriaService.convertToSearchCriterions(defaultSessionFilter())
            ).toEqual([])
        })
    });

    it('should filter out all search criterions with value eq null', () => {
        const startDate = moment()
        sessionFilter.startDate = startDate

        const expectedSearchCriteria: SearchCriteria = {
            key: SessionFilterKey.StartDate,
            operation: 'equals',
            value: startDate
        }

        expect(
            sessionSearchCriteriaService.convertToSearchCriterions(sessionFilter)
        ).toEqual([expectedSearchCriteria])
    })

    it('should set operation as IN when value is array with all string with length > 0', () => {
        const sessionTypeCodes = ['someSessionType']
        sessionFilter.sessionTypes = sessionTypeCodes

        const expectedSearchCriteria: SearchCriteria = {
            key: SessionFilterKey.SessionTypesCodes,
            operation: 'in',
            value: sessionTypeCodes
        }

        expect(
            sessionSearchCriteriaService.convertToSearchCriterions(sessionFilter)
        ).toEqual([expectedSearchCriteria])
    })

    it('should set operation as IN OR NULL when value is array that contains empty string', () => {
        const sessionTypeCodes = ['someSessionType', '']
        sessionFilter.sessionTypes = sessionTypeCodes

        const expectedSearchCriteria: SearchCriteria = {
            key: SessionFilterKey.SessionTypesCodes,
            operation: 'in or null',
            value: sessionTypeCodes
        }

        expect(
            sessionSearchCriteriaService.convertToSearchCriterions(sessionFilter)
        ).toEqual([expectedSearchCriteria])
    })
});

function defaultSessionFilter(): SessionFilters {
    return {
        sessionTypes: [],
        rooms: [],
        judges: [],
        startDate: undefined,
        endDate: undefined,
        utilization: {
            unlisted: {
                active: false,
                from: 0,
                to: 0
            },
            partListed: {
                active: false,
                from: 1,
                to: 99
            },
            fullyListed: {
                active: false,
                from: 100,
                to: 100
            },
            overListed: {
                active: false,
                from: 101,
                to: Infinity
            },
            custom: {
                active: false,
                from: 0,
                to: 0
            }
        }
    };
}
