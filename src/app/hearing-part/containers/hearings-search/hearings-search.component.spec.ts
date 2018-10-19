import { HearingsSearchComponent } from './hearings-search.component';
import { Observable } from 'rxjs/Observable';
import { DEFAULT_HEARING_FILTERS, HearingsFilters } from '../../models/hearings-filter.model';

let component: HearingsSearchComponent;
let activeRoute: any;
let searchCriteriaService: any;
let hearingPartService: any;
let hearingFilters: HearingsFilters;
let searchCriteriaServiceResult = undefined;

describe('HearingsSearchComponent', () => {
    beforeEach(() => {
        activeRoute = {
            snapshot: {
                data: {
                    judges: Observable.of([]),
                    caseTypes: Observable.of([]),
                    hearingTypes: Observable.of([]),
                }
            }
        }
        searchCriteriaService = jasmine.createSpyObj('searchCriteriaService', ['toSearchCriteria']);
        searchCriteriaService.toSearchCriteria.and.returnValue(searchCriteriaServiceResult);

        hearingPartService = jasmine.createSpyObj('hearingPartService', ['searchHearingViewmodels']);
        hearingPartService.searchHearingViewmodels.and.returnValue(Observable.of({
            content: [],
            totalElements: 0
        }));

        component = new HearingsSearchComponent(hearingPartService, activeRoute, searchCriteriaService);
        hearingFilters = DEFAULT_HEARING_FILTERS;
    });

    describe('When created', () => {
        it('in constructor it should get reference data', () => {
            expect(component.judges$).toEqual(activeRoute.snapshot.data.judges);
            expect(component.caseTypes$).toEqual(activeRoute.snapshot.data.caseTypes);
            expect(component.hearingTypes$).toEqual(activeRoute.snapshot.data.hearingTypes);
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
