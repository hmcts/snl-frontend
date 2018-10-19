import { HearingsSearchComponent } from './hearings-search.component';
import { Observable } from 'rxjs/Observable';
import { DEFAULT_HEARING_FILTERS, HearingsFilters } from '../../models/hearings-filter.model';

let component: HearingsSearchComponent;
let searchCriteriaService: any;
let judgeService: any;
let referenceDataService: any;
let hearingPartService: any;
let hearingFilters: HearingsFilters;
let searchCriteriaServiceResult = undefined;

describe('HearingsSearchComponent', () => {
    beforeEach(() => {
        searchCriteriaService = jasmine.createSpyObj('searchCriteriaService', ['toSearchCriteria']);
        searchCriteriaService.toSearchCriteria.and.returnValue(searchCriteriaServiceResult);

        judgeService = jasmine.createSpyObj('searchCriteriaService', ['get']);
        judgeService.get.and.returnValue([]);

        referenceDataService = jasmine.createSpyObj('searchCriteriaService', ['getCaseTypes', 'getHearingTypes']);
        referenceDataService.getCaseTypes.and.returnValue([]);
        referenceDataService.getHearingTypes.and.returnValue([]);

        hearingPartService = jasmine.createSpyObj('hearingPartService', ['searchHearingViewmodels']);
        hearingPartService.searchHearingViewmodels.and.returnValue(Observable.of({
            content: [],
            totalElements: 0
        }));

        component = new HearingsSearchComponent(hearingPartService, referenceDataService, judgeService, searchCriteriaService);
        hearingFilters = DEFAULT_HEARING_FILTERS;
    });

    describe('When created', () => {
        it('in onInit it should get reference data', () => {
            expect(component.judges$).toEqual(Observable.of([]));
            expect(component.caseTypes$).toEqual(Observable.of([]));
            expect(component.hearingTypes$).toEqual(Observable.of([]));
        });
    });

    describe('When filter', () => {
        it('it should call for filtered hearings', () => {
            component.onFilter(hearingFilters);
            expect(hearingPartService.searchHearingViewmodels).toHaveBeenCalledWith({
                httpParams: {
                    size: HearingsSearchComponent.DEFAULT_PAGING.pageSize,
                    page: HearingsSearchComponent.DEFAULT_PAGING.pageIndex,
                },
                searchCriteria: searchCriteriaServiceResult
            })
        });
    });

    describe('When page changed', () => {
        it('it should call for filtered hearings', () => {
            let customPageSize = 100;
            component.onNextPage({...HearingsSearchComponent.DEFAULT_PAGING, pageSize: customPageSize});
            expect(hearingPartService.searchHearingViewmodels).toHaveBeenCalledWith({
                httpParams: {
                    size: customPageSize,
                    page: HearingsSearchComponent.DEFAULT_PAGING.pageIndex,
                },
                searchCriteria: searchCriteriaServiceResult
            })
        });
    });
});
