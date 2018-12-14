import { HearingsSearchComponent } from './hearings-search.component';
import { Observable } from 'rxjs/Observable';
import { DEFAULT_HEARING_FILTERS, HearingsFilters } from '../../models/hearings-filter.model';
import * as moment from 'moment';
import { Priority } from '../../models/priority-model';
import { FilteredHearingViewmodel, HearingViewmodelForAmendment } from '../../models/filtered-hearing-viewmodel';
import { Note } from '../../../notes/models/note.model';
import { Status } from '../../../core/reference/models/status.model';
import { ListingStatus } from '../../models/listing-status-model';

const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

const openDialogMockObjUndefined = {
    afterClosed: (): Observable<boolean> => Observable.of(undefined)
};

const openDialogMockObjConfirmed = {
    afterClosed: (): Observable<boolean> => Observable.of(true)
};
const now = moment();
const openDialogMockObjDeclined = {
    afterClosed: (): Observable<boolean> => Observable.of(false)
};

let component: HearingsSearchComponent;
let searchCriteriaService: any;
let route: any;
let hearingService: any;
let hearingPartModificationService: any;
let notesService: any;
let hearingFilters: HearingsFilters;
let searchCriteriaServiceResult = undefined;
let hearingPartServiceResult = {
    content: [],
    totalElements: 7
};
let hearingModel: FilteredHearingViewmodel;

describe('HearingsSearchComponent', () => {
    beforeEach(() => {
        searchCriteriaService = jasmine.createSpyObj('searchCriteriaService', ['toSearchCriteria']);
        searchCriteriaService.toSearchCriteria.and.returnValue(searchCriteriaServiceResult);

        route = {
            data: Observable.of({judges: [], caseTypes: [], hearingTypes: []})
        };

        hearingService = jasmine.createSpyObj('hearingService', ['seearchFilteredHearingViewmodels', 'getForAmendment']);
        hearingService.seearchFilteredHearingViewmodels.and.returnValue(Observable.of(hearingPartServiceResult));

        hearingPartModificationService = jasmine.createSpyObj('hearingModificationService',
            ['updateListingRequest', 'open', 'deleteHearing', 'removeFromState']);
        notesService = jasmine.createSpyObj('notesService', ['getByEntities', 'upsertManyNotes']);

        component = new HearingsSearchComponent(hearingPartModificationService, route,
            hearingService,
            matDialogSpy, notesService, searchCriteriaService);

        hearingFilters = DEFAULT_HEARING_FILTERS;
        hearingModel = {
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
            status: Status.Listed
        } as FilteredHearingViewmodel;
    });

    describe('When created', () => {
        it('in onInit it should get reference data', () => {
            component.ngOnInit();

            expect(component.judges).toEqual([]);
            expect(component.caseTypes).toEqual([]);
            expect(component.hearingTypes).toEqual([]);
        });
    });

    describe('When filter', () => {
        it('it should call for filtered hearings and update totalCount and hearings properties', () => {
            component.onFilter(hearingFilters);

            expect(hearingService.seearchFilteredHearingViewmodels).toHaveBeenCalledWith({
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

            expect(hearingService.seearchFilteredHearingViewmodels).toHaveBeenCalledWith({
                httpParams: {
                    size: customPageSize,
                    page: HearingsSearchComponent.DEFAULT_PAGING.pageIndex,
                },
                searchCriteria: searchCriteriaServiceResult
            })
        });
    });

    describe('When delete hearing', () => {
        it('declining on delete dialog should not call service method', () => {
            matDialogSpy.open.and.returnValue(openDialogMockObjDeclined);

            component.onDelete(hearingModel);

            expect(hearingPartModificationService.deleteHearing).not.toHaveBeenCalled();
            expect(matDialogSpy.open).toHaveBeenCalled();
        })

        it('accepting on delete dialog should call service method', () => {
            matDialogSpy.open.and.returnValue(openDialogMockObjConfirmed);

            component.onDelete(hearingModel);

            expect(hearingPartModificationService.deleteHearing).toHaveBeenCalled();
            expect(matDialogSpy.open).toHaveBeenCalled();
        })
    })

    describe('When amend', () => {
        const notes = [{} as Note, {} as Note, {} as Note];
        const updateHearingModel: HearingViewmodelForAmendment = {
            hearing: {
                id: '123',
                caseNumber: '123',
                caseTitle: '213',
                caseTypeCode: 'caseTypeCode',
                caseTypeDescription: 'caseTypeCode',
                hearingTypeCode: 'hearingTypeCode',
                hearingTypeDescription: 'hearingTypeCode',
                duration: moment.duration(12),
                scheduleStart: now,
                scheduleEnd: now,
                reservedJudgeId: '123',
                reservedJudgeName: '123',
                communicationFacilitator: 'transaltor',
                priority: Priority.Low,
                version: 1,
                personName: 'asd',
                status: ListingStatus.Listed,
                numberOfSessions: 1,
                multiSession: false,
                listingDate: undefined
            },
            notes: []
        };

        beforeEach(() => {
            hearingService.getForAmendment.and.returnValue(Observable.of(hearingModel));
            notesService.getByEntities.and.returnValue(Observable.of([]));
        });

        it('the hearing and notes should be fetched', () => {
            matDialogSpy.open.and.returnValue(openDialogMockObjUndefined);

            component.onAmend(hearingModel.id);

            expect(hearingService.getForAmendment).toHaveBeenCalledWith(hearingModel.id);
            expect(notesService.getByEntities).toHaveBeenCalledWith([hearingModel.id])
        });

        it('update of listing is not made when dialog returns undefined', () => {
            matDialogSpy.open.and.returnValue(openDialogMockObjUndefined);

            component.onAmend(hearingModel.id);

            expect(hearingPartModificationService.updateListingRequest).not.toHaveBeenCalled();
        });

        it('update of listing is made when dialog returns a defined object', () => {
            const openDialogMockObj = {
                afterClosed: (): Observable<HearingViewmodelForAmendment> => Observable.of(updateHearingModel)
            };
            matDialogSpy.open.and.returnValue(openDialogMockObj);

            component.onAmend(hearingModel.id);

            expect(hearingPartModificationService.updateListingRequest).toHaveBeenCalledWith(updateHearingModel);
        });

        it('when confirmed and notes are non zero-length then note service is called', () => {
            const openDialogMockObj = {
                afterClosed: (): Observable<HearingViewmodelForAmendment> => Observable.of({...updateHearingModel, notes: notes})
            };
            notesService.upsertManyNotes.and.returnValue(Observable.of([]));
            matDialogSpy.open.and.returnValues(openDialogMockObj, openDialogMockObjConfirmed);

            component.onAmend(hearingModel.id);

            expect(notesService.upsertManyNotes).toHaveBeenCalledWith(notes);
            expect(hearingService.seearchFilteredHearingViewmodels).toHaveBeenCalled();
        })
    })
});
