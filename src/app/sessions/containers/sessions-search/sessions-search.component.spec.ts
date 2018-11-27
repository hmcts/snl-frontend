import { TestBed } from '@angular/core/testing';
import { SessionsSearchComponent } from './sessions-search.component';
import { StoreModule, Store } from '@ngrx/store';
import * as sessionReducers from '../../reducers/index';
import * as judgesReducers from '../../../judges/reducers/index';
import * as sessionTypeReducer from '../../../core/reference/reducers/session-type.reducer';
import { MatDialog } from '@angular/material';
import * as roomActions from '../../../rooms/actions/room.action';
import * as judgeActions from '../../../judges/actions/judge.action';
import * as referenceDataActions from '../../../core/reference/actions/reference-data.action';
import { SessionSearchResponse } from '../../models/session-search-response.model';
import { SessionsService } from '../../services/sessions-service';
import { SessionSearchCriteriaService } from '../../services/session-search-criteria.service';
import { NotesService } from '../../../notes/services/notes.service';
import { Observable } from 'rxjs';
import { TableSetting } from '../../models/table-settings.model';
import { SessionFilters } from '../../models/session-filter.model';
import { SearchCriteria } from '../../../hearing-part/models/search-criteria';
import { SessionAmendResponse } from '../../models/session-amend.response';
import { Page } from '../../../problems/models/problem.model';

let component: SessionsSearchComponent
const mockMatDialog: jasmine.SpyObj<MatDialog> = jasmine.createSpyObj('MatDialog', ['open'])
const mockSessionService: jasmine.SpyObj<SessionsService> =
    jasmine.createSpyObj('SessionsService', ['paginatedSearchSessions', 'getSessionAmendById'])
const mockSessionSearchCriteriaService: jasmine.SpyObj<SessionSearchCriteriaService> =
    jasmine.createSpyObj('SessionSearchCriteriaService', ['convertToSearchCriterions'])
const mockNotesService: jasmine.SpyObj<NotesService> =
    jasmine.createSpyObj('NotesService', ['getByEntities'])
let storeSpy;
let store: Store<any>;
const tableSettings: TableSetting = {
    sortByProperty: 'test',
    sortDirection: 'asc',
    pageIndex: 0,
    pageSize: 10
}
const searchCriterions: SearchCriteria[] = [{
    key: 'room',
    operation: 'equal',
    value: ['room-id']
}]
const expectedSessionId = 'Session-id'
const sessionSearchResponse: any = { sessionId: expectedSessionId } as SessionSearchResponse;

describe('SessionsSearchComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({}),
                // session store module includes rooms
                StoreModule.forFeature('sessions', sessionReducers.reducers),
                StoreModule.forFeature('judges', judgesReducers.reducers),
                StoreModule.forFeature('sessionTypes', sessionTypeReducer.reducer),
            ],
            providers: [
                SessionsSearchComponent,
                Store,
                { provide: SessionsService, useValue: mockSessionService },
                { provide: SessionSearchCriteriaService, useValue: mockSessionSearchCriteriaService },
                { provide: NotesService, useValue: mockNotesService },
                { provide: MatDialog, useValue: mockMatDialog },
            ]
        });
        store = TestBed.get(Store);
        store.dispatch(new roomActions.GetComplete([]))
        store.dispatch(new judgeActions.GetComplete([]))
        store.dispatch(new referenceDataActions.GetAllSessionTypeComplete([]))
        component = TestBed.get(SessionsSearchComponent);
    })

    describe('constructor', () => {
        it('should be defined', () => {
            expect(component).toBeDefined();
        });

        it('should set start and end date', () => {
            expect(component.startDate).toBeDefined()
            expect(component.endDate).toBeDefined()
        });

        it('should set rooms, judges and sessionTypes', () => {
            expect(component.rooms).toBeDefined()
            expect(component.judges).toBeDefined()
            expect(component.sessionTypes).toBeDefined()
        });
    });

    describe('ngOnInit', () => {
        [
            { actionName: 'RoomActions.Get', instance: roomActions.Get },
            { actionName: 'JudgeActions.Get', instance: judgeActions.Get }
        ]
        .forEach(pair => {
            it(`should dispatch ${pair.actionName}`, () => {
                component.sessionAmendmentTableComponent = {tableSettings$: Observable.of() } as any;
                component.sessionFilterComponent = { sessionFilter$: Observable.of() } as any;

                storeSpy = spyOn(store, 'dispatch').and.callThrough();
                component.ngOnInit()
                const actions = storeSpy.calls.allArgs()
                    .filter(arg => arg[0] instanceof pair.instance);
                expect(actions.length).toEqual(1);
            });
        });

        describe('when TableSettings and PaginationSettings are available ', () => {
            it('should make request for session', () => {
                const sessionFilters: SessionFilters = defaultSessionFilter();
                sessionFilters.rooms = ['room-id'];

                mockSessionSearchCriteriaService.convertToSearchCriterions.and.returnValue(searchCriterions)
                mockSessionService.paginatedSearchSessions.and.returnValue(Observable.of())

                component.sessionAmendmentTableComponent = {tableSettings$: Observable.of(tableSettings) } as any;
                component.sessionFilterComponent = { sessionFilter$: Observable.of(sessionFilters) } as any;

                component.ngOnInit()

                expect(mockSessionService.paginatedSearchSessions).toHaveBeenCalled()
            });
        });
    });

    describe('openAmendDialog', () => {
        it('should fetch session and its notes', () => {
            mockNotesService.getByEntities.and.returnValue({ combineLatest: () => { return Observable.of() } })
            mockSessionService.getSessionAmendById.and.returnValue(Observable.of())

            component.openAmendDialog(sessionSearchResponse)

            expect(mockNotesService.getByEntities).toHaveBeenCalledWith([expectedSessionId])
            expect(mockSessionService.getSessionAmendById).toHaveBeenCalledWith(expectedSessionId)
        })

        describe('when it fetch notes and session', () => {
            it('should open dialog', () => {
                const sessionAmendResponse = { id: expectedSessionId } as SessionAmendResponse;
                const mockNotes = {};

                mockNotesService.getByEntities.and.returnValue(Observable.of(mockNotes))
                mockSessionService.getSessionAmendById.and.returnValue(Observable.of(sessionAmendResponse))
                mockMatDialog.open.and.returnValue({afterClosed: () => { return { subscribe: () => {} }}})

                component.openAmendDialog(sessionSearchResponse)

                expect(mockNotesService.getByEntities).toHaveBeenCalledWith([expectedSessionId])
                expect(mockSessionService.getSessionAmendById).toHaveBeenCalledWith(expectedSessionId)

                expect(mockMatDialog.open).toHaveBeenCalled()
            })
        });
    })

    describe('searchSessions', () => {
        it('should save recent search criterion and table settings', () => {
            mockSessionService.paginatedSearchSessions.and.returnValue(Observable.of())
            component.searchSessions(searchCriterions, tableSettings)

            expect(component.savedSearchCriterion).toBe(searchCriterions)
            expect(component.savedTableSettings).toBe(tableSettings)
        });

        it('should fetch and set sessions', () => {
            const totalCount = 1;
            const pagedSessionSearchResponse: Page<SessionSearchResponse> = {
                content: [ sessionSearchResponse ],
                last: true,
                totalElements: 1,
                totalPages: 1,
                size: 1,
                number: 1,
                first: true,
                sort: null,
                numberOfElements: 1
            }

            mockSessionService.paginatedSearchSessions.and.returnValue(Observable.of(pagedSessionSearchResponse))

            component.searchSessions(searchCriterions, tableSettings)

            expect(component.filteredSessions).toBe(pagedSessionSearchResponse.content)
            expect(component.totalCount).toBe(totalCount)
        });
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
