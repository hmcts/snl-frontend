import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { SessionsListingsSearchComponent } from './sessions-listings-search.component';
import { HearingsTableComponent } from '../../../hearing-part/components/hearings-table/hearings-table.component';
import { SessionTableComponent } from '../../components/session-table/session-table.component';

import { DEFAULT_SESSION_FOR_LISTING, SessionForListingWithNotes } from '../../models/session.viewmodel';
import { AssignHearingData } from '../../../hearing-part/components/assign-hearing-dialog/assign-hearing-dialog.component';

import { DEFAULT_HEARING_FOR_LISTING_WITH_NOTES } from '../../../hearing-part/models/hearing-for-listing-with-notes.model';
import { DEFAULT_SESSION_FILTERS } from '../../models/session-filter.model';

let route: any;
let sessionsFilterMock: any;
let hearingsTableMock: any;
let sessionsTableMock: any;
let matDialogSpy: any;
let hearingService: any;
let notesService: any;
let sessionsService: any;
let sessionsSearchCriteriaService: any;

const openDialogMockObjConfirmed = {
    afterClosed: (): Observable<boolean> => Observable.of(true)
};
// const openDialogMockObjDeclined = {
//     afterClosed: (): Observable<boolean> => Observable.of(false)
// };

let component: SessionsListingsSearchComponent;
let mockedFullSession: SessionForListingWithNotes[];
const nowMoment = moment();

let roomsArray = [];
let sessionTypesArray = [];
let judgesArray = [];
let hearingsArray = [];
let sessionsArray = [];

let hearing = {...DEFAULT_HEARING_FOR_LISTING_WITH_NOTES, id: 'id', version: 1};

describe('SessionsListingsSearchComponent', () => {
    beforeEach(() => {
        route = {
            data: Observable.of({judges: judgesArray, sessionTypes: sessionTypesArray, rooms: roomsArray})
        };

        hearingsTableMock = jasmine.createSpyObj('hearingsTableMock', ['clearSelection']);
        hearingsTableMock.tableSettingsSource$ = new BehaviorSubject(HearingsTableComponent.DEFAULT_TABLE_SETTINGS);

        sessionsTableMock = jasmine.createSpyObj('sessionsTableMock', ['clearSelection', 'goToFirstPage']);
        sessionsTableMock.tableSettingsSource$ = new BehaviorSubject(SessionTableComponent.DEFAULT_TABLE_SETTINGS);

        sessionsFilterMock = jasmine.createSpyObj('sessionsFilterMock', ['filterSource$']);
        sessionsFilterMock.filterSource$ = new BehaviorSubject(DEFAULT_SESSION_FILTERS);

        hearingService = jasmine.createSpyObj('hearingService', ['assignToSession', 'getHearingsForListing']);
        hearingService.getHearingsForListing.and.returnValue(Observable.of({content: hearingsArray, totalElements: 0}));

        notesService = jasmine.createSpyObj('notesService', ['upsertManyNotes']);
        notesService.upsertManyNotes.and.returnValue(Observable.of(true));

        sessionsService = jasmine.createSpyObj('sessionsService', ['assignToSession', 'getSessionsForListing']);
        sessionsService.getSessionsForListing.and.returnValue(Observable.of({content: sessionsArray, totalElements: 0}));

        sessionsSearchCriteriaService = jasmine.createSpyObj('sessionsSearchCriteriaService', ['convertToSearchCriterions']);
        sessionsSearchCriteriaService.convertToSearchCriterions.and.returnValue([]);

        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

        mockedFullSession = [defaultFullMockedSession()];

        component = new SessionsListingsSearchComponent(hearingService, notesService, sessionsService,
            sessionsSearchCriteriaService, route, matDialogSpy);

        component.hearingsTable = hearingsTableMock;
        component.sessionsTable = sessionsTableMock;
        component.sessionFilter = sessionsFilterMock;
        component.ngOnInit();
    });

    describe('constructor', () => {
        it('should be defined', () => {
            expect(component).toBeDefined();
        });
        it('should fetch hearings', () => {
            component.hearings$.subscribe(hearings => {
                expect(hearings).toBe(hearingsArray);
            });
        });
        it('should resolve route data', () => {
            component.rooms$.subscribe(rooms => {
                expect(rooms).toBe(roomsArray);
            });
            component.judges$.subscribe(judges => {
                expect(judges).toBe(judgesArray);
            });
            component.sessionTypes$.subscribe(sessionTypes => {
                expect(sessionTypes).toBe(sessionTypesArray);
            });
        });
        it('should set null to hearingSelectionModel', () => {
            expect(component.selectedHearing).toBeUndefined();
        });
        it('should set selectedSessions to empty obj', () => {
            expect(component.selectedSessions).toEqual([]);
        });
    });

    describe('selectHearing', () => {
        it('should set hearingSelectionModel', () => {
            component.selectHearing(DEFAULT_HEARING_FOR_LISTING_WITH_NOTES);
            expect(component.selectedHearing).toEqual(DEFAULT_HEARING_FOR_LISTING_WITH_NOTES);
        });
    });

    describe('assignToSessions', () => {
        it('should dispatch AssignToSession action', () => {
            const startTime = '10:30';

            component.selectedSessions = [mockedFullSession[0]];
            component.selectedHearing = hearing;

            matDialogSpy.open.and.returnValue(openDialogMockObjConfirmed);

            component.assignToSessions({
                confirmed: true,
                startTime: startTime
            } as AssignHearingData);

            expect(hearingService.assignToSession).toHaveBeenCalledWith({
                hearingId: hearing.id,
                hearingVersion: hearing.version,
                sessionsData: [
                    {
                        sessionId: mockedFullSession[0].sessionId,
                        sessionVersion: mockedFullSession[0].sessionVersion
                    }
                ],
                userTransactionId: jasmine.any(String),
                // unfortunately we cannot test value of date here
                // because jasmine does let us check the value and compares reference. Custom equal didn't work here
                start: jasmine.any(Date)
            })
        });
    });

    describe('selectSessions', () => {
        it('should set selectSessions', () => {
            const expectedSelectedSession = mockedFullSession;
            expect(component.selectedSessions).toEqual([]);
            component.selectSession(expectedSelectedSession);
            expect(component.selectedSessions).toEqual(expectedSelectedSession);
        });
    });

    describe('assignButtonEnabled', () => {
        describe('when hearingSelectionModel is not null and selectedSessions is set', () => {
            it('should return true ', () => {
                component.selectHearing(hearing);
                component.selectSession(mockedFullSession);
                expect(component.assignButtonEnabled()).toEqual(true);
            });
        });
        describe('when either hearingSelectionModel is not null or selectedSessions is not set', () => {
            it('should return false ', () => {
                component.selectSession([]);
                component.selectHearing(hearing);
                expect(component.assignButtonEnabled()).toEqual(false);
            });
            it('should return false ', () => {
                component.selectSession([]);
                component.selectHearing(undefined);
                expect(component.assignButtonEnabled()).toEqual(false);
            });
        });
    });
});

function defaultFullMockedSession(): SessionForListingWithNotes {
    return {
        ...DEFAULT_SESSION_FOR_LISTING,
        sessionId: 'some-session-id',
        startDate: nowMoment,
        duration: moment.duration(600, 'minutes'),
        roomId: undefined,
        personId: undefined,
        sessionTypeDescription: undefined,
        sessionVersion: 1,
        allocatedDuration: moment.duration('PT30M'),
        utilisation: 20,
        available: moment.duration('PT0M'),
        notes: []
    };
}
