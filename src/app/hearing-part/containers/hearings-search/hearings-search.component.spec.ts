import { HearingsSearchComponent } from './hearings-search.component';
import { Observable } from 'rxjs/Observable';
import { DEFAULT_HEARING_FILTERS, HearingsFilters } from '../../models/hearings-filter.model';
import * as moment from 'moment';
import { Priority } from '../../models/priority-model';
import { FilteredHearingViewmodel } from '../../models/filtered-hearing-viewmodel';

const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
const hearingModificationService = jasmine.createSpyObj('HearingModificationService', ['open', 'deleteHearing', 'removeFromState']);

const openDialogMockObjConfirmed = {
    afterClosed: (): Observable<boolean> => Observable.of(true)
};
const now = moment();
const openDialogMockObjDeclined = {
    afterClosed: (): Observable<boolean> => Observable.of(false)
};

let component: HearingsSearchComponent;
let searchCriteriaService: any;
let judgeService: any;
let referenceDataService: any;
let hearingPartService: any;
let hearingFilters: HearingsFilters;
let searchCriteriaServiceResult = undefined;
let hearingPartServiceResult = {
    content: [],
    totalElements: 7
}

describe('HearingsSearchComponent', () => {
    beforeEach(() => {
        searchCriteriaService = jasmine.createSpyObj('searchCriteriaService', ['toSearchCriteria']);
        searchCriteriaService.toSearchCriteria.and.returnValue(searchCriteriaServiceResult);

        judgeService = jasmine.createSpyObj('judgeService', ['get']);
        judgeService.get.and.returnValue(Observable.of([]));

        referenceDataService = jasmine.createSpyObj('searchCriteriaService', ['getCaseTypes', 'getHearingTypes']);
        referenceDataService.getCaseTypes.and.returnValue(Observable.of([]));
        referenceDataService.getHearingTypes.and.returnValue(Observable.of([]));

        hearingPartService = jasmine.createSpyObj('hearingPartService', ['seearchFilteredHearingViewmodels']);
        hearingPartService.seearchFilteredHearingViewmodels.and.returnValue(Observable.of(hearingPartServiceResult));

        component = new HearingsSearchComponent(matDialogSpy, hearingModificationService, hearingPartService,
            referenceDataService, judgeService, searchCriteriaService);
        hearingFilters = DEFAULT_HEARING_FILTERS;
    });

    describe('When created', () => {
        it('in onInit it should get reference data', () => {
            component.ngOnInit();

            expect(component.judges$).toEqual(Observable.of([]));
            expect(component.caseTypes$).toEqual(Observable.of([]));
            expect(component.hearingTypes$).toEqual(Observable.of([]));
        });
    });

    describe('When filter', () => {
        it('it should call for filtered hearings and update totalCount and hearings properties', () => {
            component.onFilter(hearingFilters);

            expect(hearingPartService.seearchFilteredHearingViewmodels).toHaveBeenCalledWith({
                httpParams: {
                    size: HearingsSearchComponent.DEFAULT_PAGING.pageSize,
                    page: HearingsSearchComponent.DEFAULT_PAGING.pageIndex,
                },
                searchCriteria: searchCriteriaServiceResult
            });

            expect(component.totalCount).toEqual(hearingPartServiceResult.totalElements);
            expect(component.filteredHearings).toEqual(hearingPartServiceResult.content);
        });
    });

    describe('When page changed', () => {
        it('it should call for filtered hearings', () => {
            let customPageSize = 100;
            component.onNextPage({...HearingsSearchComponent.DEFAULT_PAGING, pageSize: customPageSize});

            expect(hearingPartService.seearchFilteredHearingViewmodels).toHaveBeenCalledWith({
                httpParams: {
                    size: customPageSize,
                    page: HearingsSearchComponent.DEFAULT_PAGING.pageIndex,
                },
                searchCriteria: searchCriteriaServiceResult
            })
        });
    });

    describe('When delete hearing', () => {
        const hearingModel = {
            id: '123',
            caseNumber: '123',
            caseTitle: '213',
            caseTypeCode: 'caseTypeCode',
            caseTypeDescription: 'caseTypeDescription',
            hearingTypeCode: 'hearingTypeCode',
            hearingTypeDescription: 'hearingTypeDescription',
            duration: moment.duration(12),
            scheduleStart: now,
            scheduleEnd: now,
            reservedJudgeId: '123',
            reservedJudgeName: 'judgeName',
            communicationFacilitator: 'transaltor',
            priority: Priority.Low,
            version: 1,
            listingDate: now,
            isListed: true
        } as FilteredHearingViewmodel;

        it('declining on delete dialog should not call service method', () => {
            matDialogSpy.open.and.returnValue(openDialogMockObjDeclined);

            component.onDelete(hearingModel);

            expect(hearingModificationService.deleteHearing).not.toHaveBeenCalled();
            expect(matDialogSpy.open).toHaveBeenCalled();
        })

        it('accepting on delete dialog should call service method', () => {
            matDialogSpy.open.and.returnValue(openDialogMockObjConfirmed);

            component.onDelete(hearingModel);

            expect(hearingModificationService.deleteHearing).toHaveBeenCalled();
            expect(matDialogSpy.open).toHaveBeenCalled();
        })
    })
});
