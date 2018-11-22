import { HearingToSessionAssignment } from '../../../hearing-part/models/hearing-to-session-assignment';
import { Judge } from '../../../judges/models/judge.model';
import * as sessionReducers from '../../reducers';
import * as transactionsReducers from '../../../features/transactions/reducers';
import { Room } from '../../../rooms/models/room.model';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { Store, StoreModule } from '@ngrx/store';
import { SessionsListingsSearchComponent } from './sessions-listings-search.component';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SessionsStatisticsService } from '../../services/sessions-statistics-service';
import * as fromHearingParts from '../../../hearing-part/reducers';
import * as hearingPartActions from '../../../hearing-part/actions/hearing-part.action';
import * as hearingActions from '../../../hearing-part/actions/hearing.action';
import * as moment from 'moment';
import * as roomActions from '../../../rooms/actions/room.action';
import * as judgeActions from '../../../judges/actions/judge.action';
import * as referenceDataActions from '../../../core/reference/actions/reference-data.action';
import * as caseTypeReducers from '../../../core/reference/reducers/case-type.reducer';
import * as sessionTypeReducers from '../../../core/reference/reducers/session-type.reducer';
import * as hearingTypeReducers from '../../../core/reference/reducers/hearing-type.reducer';
import * as judgesReducers from '../../../judges/reducers';
import * as notesReducers from '../../../notes/reducers';

import * as sessionsActions from '../../actions/session.action';
import { SessionViewModel } from '../../models/session.viewmodel';
import { Session } from '../../models/session.model';
import { SessionFilters } from '../../models/session-filter.model';
import { HearingModificationService } from '../../../hearing-part/services/hearing-modification.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import * as notesActions from '../../../notes/actions/notes.action';
import { Note } from '../../../notes/models/note.model';
import { HearingPartViewModel } from '../../../hearing-part/models/hearing-part.viewmodel';
import { Priority } from '../../../hearing-part/models/priority-model';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import { SessionType } from '../../../core/reference/models/session-type';
import { SessionsFilterService } from '../../services/sessions-filter-service';
import { HearingPartResponse } from '../../../hearing-part/models/hearing-part-response';
import { Hearing } from '../../../hearing-part/models/hearing';
import { HearingForListingWithNotes } from '../../../hearing-part/models/hearing.viewmodel';
import { AssignHearingData } from '../../../hearing-part/components/assign-hearing-dialog/assign-hearing-dialog.component';

let storeSpy: jasmine.Spy;
let component: SessionsListingsSearchComponent;
let store: Store<fromHearingParts.State>;
let mockedFullSession: SessionViewModel[];
const nowMoment = moment();
const nowISOSting = nowMoment.toISOString();
const roomId = 'some-room-id';
const judgeId = 'some-judge-id';
const stubCaseType = {code: 'some-case-type-code', description: 'some-case-type'} as CaseType;
const stubCaseTypes = [stubCaseType];
const stubSessionType = {code: 'some-session-type-code', description: 'some-session-type'} as SessionType;
const stubSessionTypes = [stubSessionType];
const stubHearingType = {code: 'some-hearing-type-code', description: 'some-hearing-type'} as HearingType;
const stubHearingTypes = [stubHearingType];
const durationStringFormat = 'PT30M';
const sessionDuration = moment.duration(durationStringFormat).asMilliseconds();
const overListedDuration = moment.duration('PT31M').asMilliseconds();
const notListedDuration = moment.duration('PT0M').asMilliseconds();
const customDuration = moment.duration('PT16M').asMilliseconds();
const mockedRooms: Room[] = [{ id: roomId, name: 'some-room-name', roomTypeCode: 'code' }];
const mockedJudges: Judge[] = [{ id: judgeId, name: 'some-judge-name' }];
const mockedNotes: Note[] = [
    {
        id: 'note-id',
        content: 'nice content',
        type: 'Facility Requirements',
        entityId: '1e4f95f1-62b9-48d1-9fa1-24b025111fa0',
        entityType: 'ListingRequest',
        createdAt: undefined,
        modifiedBy: undefined
    }];

const mockedHearingPartResponse: HearingPartResponse = {
  id: 'some-id',
  sessionId: null,
  hearingInfo: '1e4f95f1-62b9-48d1-9fa1-24b025111fa0',
  version: 2,
  start: nowISOSting
};

const mockedUnlistedHearingPartVM: HearingPartViewModel = {
    id: 'some-id',
    sessionId: null,
    hearingId: '1e4f95f1-62b9-48d1-9fa1-24b025111fa0',
    caseNumber: 'abc123',
    caseTitle: 'fast-track',
    caseType: stubCaseType,
    hearingType: stubHearingType,
    duration: moment.duration(durationStringFormat),
    scheduleStart: moment(nowISOSting),
    scheduleEnd: moment(nowISOSting),
    version: 2,
    priority: Priority.Low,
    reservedJudgeId: judgeId,
    communicationFacilitator: 'interpreter',
    notes: [],
    reservedJudge: mockedJudges[0],
    start: moment(nowISOSting),
    multiSession: false
};

const mockedUnlistedHearingVM: HearingForListingWithNotes = {
    id: '1e4f95f1-62b9-48d1-9fa1-24b025111fa0',
    caseNumber: 'abc123',
    caseTitle: 'fast-track',
    caseType: stubCaseType,
    hearingType: stubHearingType,
    duration: moment.duration(durationStringFormat),
    scheduleStart: moment(nowISOSting),
    scheduleEnd: moment(nowISOSting),
    version: 2,
    priority: Priority.Low,
    reservedJudgeId: judgeId,
    communicationFacilitator: 'interpreter',
    notes: mockedNotes,
    reservedJudge: mockedJudges[0],
    isListed: false,
    numberOfSessions: 1,
    multiSession: false
}

const mockedHearingResponse: Hearing = {
    caseNumber: 'abc123',
    caseTitle: 'fast-track',
    caseTypeCode: 'some-case-type-code',
    communicationFacilitator: 'interpreter',
    deleted: false,
    duration: durationStringFormat,
    hearingTypeCode: 'some-hearing-type-code',
    id: '1e4f95f1-62b9-48d1-9fa1-24b025111fa0',
    priority: 'Low',
    reservedJudgeId: judgeId,
    scheduleEnd: nowISOSting,
    scheduleStart: nowISOSting,
    version: 2,
    numberOfSessions: 1,
    multiSession: false
}

// same as unlisted, but with session set to matching id in Session
let mockedListedHearingPartVM: HearingPartViewModel = { ...mockedUnlistedHearingPartVM, sessionId: 'some-session-id' };
let mockedListedHearingPart: HearingPartResponse = { ...mockedHearingPartResponse, sessionId: 'some-session-id' };
const mockedListedHearingPartsVM: HearingPartViewModel[] = [mockedListedHearingPartVM];
const mockedListedHearingPartResponses: HearingPartResponse[] = [mockedListedHearingPart];

const mockedSessions: Session[] = [
  {
    id: 'some-session-id',
    start: nowMoment,
    duration: sessionDuration,
    room: roomId,
    person: judgeId,
    sessionTypeCode: stubSessionType.code,
    // hearingTypes: [stubHearingType.code],
    jurisdiction: 'some jurisdiction',
    version: 1
  }
];

describe('SessionsListingsSearchComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularMaterialModule,
        FormsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('hearingParts', fromHearingParts.reducers),
        StoreModule.forFeature('sessions', sessionReducers.reducers),
        StoreModule.forFeature('judges', judgesReducers.reducers),
        StoreModule.forFeature('notes', notesReducers.reducers),
        StoreModule.forFeature('caseTypes', caseTypeReducers.reducer),
        StoreModule.forFeature('sessionTypes', sessionTypeReducers.reducer),
        StoreModule.forFeature('hearingTypes', hearingTypeReducers.reducer),
        StoreModule.forFeature('transactions', transactionsReducers.reducers),
        BrowserAnimationsModule
      ],
      providers: [SessionsListingsSearchComponent, SessionsStatisticsService, HearingModificationService, SessionsFilterService],
      declarations: [TransactionDialogComponent]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [TransactionDialogComponent]
      }
    });

    mockedFullSession = [defaultFullMockedSession()];
    component = TestBed.get(SessionsListingsSearchComponent);
    store = TestBed.get(Store);
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(component).toBeDefined();
    });
    it('should fetch hearings', () => {
      store.dispatch(new referenceDataActions.GetAllCaseTypeComplete(stubCaseTypes));
      store.dispatch(new referenceDataActions.GetAllHearingTypeComplete(stubHearingTypes));
      store.dispatch(new hearingActions.SearchComplete([mockedHearingResponse]));
      store.dispatch(new hearingPartActions.SearchComplete([mockedHearingPartResponse]));
      store.dispatch(new notesActions.UpsertMany(mockedNotes));
      store.dispatch(new judgeActions.GetComplete(mockedJudges));

      component.hearings$.subscribe(hearingParts => {
        expect(hearingParts).toEqual([mockedUnlistedHearingVM]);
      });
    });
    it('should fetch rooms', () => {
      store.dispatch(new roomActions.GetComplete(mockedRooms));
      component.rooms$.subscribe(rooms => {
        expect(rooms).toEqual(mockedRooms);
      });
    });
    it('should fetch judges', () => {
      store.dispatch(new judgeActions.GetComplete(mockedJudges));
      component.judges$.subscribe(judges => {
        expect(judges).toEqual(mockedJudges);
      });
    });
    it('should fetch full sessions', () => {
      store.dispatch(new referenceDataActions.GetAllCaseTypeComplete(stubCaseTypes));
      store.dispatch(new referenceDataActions.GetAllHearingTypeComplete(stubHearingTypes));
      store.dispatch(new referenceDataActions.GetAllSessionTypeComplete(stubSessionTypes));
      store.dispatch(new notesActions.UpsertMany(mockedNotes));
      store.dispatch(new hearingActions.SearchComplete([mockedHearingResponse]));
      store.dispatch(new hearingPartActions.SearchComplete(mockedListedHearingPartResponses));
      store.dispatch(new roomActions.GetComplete(mockedRooms));
      store.dispatch(new judgeActions.GetComplete(mockedJudges));
      store.dispatch(new sessionsActions.SearchComplete(mockedSessions));

      component.sessions$.subscribe(sessions => {
        expect(sessions).toEqual(mockedFullSession);
      });
    });
    it('should set start and end date', () => {
      expect(component.startDate).toBeDefined();
      expect(component.endDate).toBeDefined();
    });
    it('should set null to hearingSelectionModel', () => {
      expect(component.selectedHearing).toBeUndefined();
    });
    it('should set selectedSessions to empty obj', () => {
      expect(component.selectedSessions).toEqual([]);
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should dispatch [Session] SearchForDates action', () => {
      const passedObj = storeSpy.calls.argsFor(0)[0];
      expect(passedObj instanceof sessionsActions.SearchForDates).toBeTruthy();
    });
    it('should dispatch [HearingParts] Search action', () => {
      component.ngOnInit();
      const passedObj = storeSpy.calls.argsFor(1)[0];
      expect(passedObj instanceof hearingPartActions.Search).toBeTruthy();
    });
    it('should dispatch [RoomActions] Get action', () => {
      component.ngOnInit();
      const passedObj = storeSpy.calls.argsFor(2)[0];
      expect(passedObj instanceof roomActions.Get).toBeTruthy();
    });
    it('should dispatch [JudgeActions] Get action', () => {
      component.ngOnInit();
      const passedObj = storeSpy.calls.argsFor(3)[0];
      expect(passedObj instanceof judgeActions.Get).toBeTruthy();
    });
  });

  describe('filterSessions', () => {
    let sessionFilter: SessionFilters;
    beforeEach(() => {
      sessionFilter = defaultSessionFilter();
    });
    describe('when start dates are different', () => {
      let startDayAsTomorrowFilters: SessionFilters;
      beforeEach(() => {
        startDayAsTomorrowFilters = defaultSessionFilter();
        startDayAsTomorrowFilters.startDate = moment().add(1, 'day');
        component.filterSessions([], startDayAsTomorrowFilters);
      });
      it('should dispatch [Session] SearchForDates action', () => {
        const action = storeSpy.calls.first().args[0];
        expect(action instanceof sessionsActions.SearchForDates).toBeTruthy();
      });
      it('should set startDate equal to filters.startDate', () => {
        expect(component.startDate).toBe(startDayAsTomorrowFilters.startDate);
      });
      it('should set endDate equal to filters.endDate', () => {
        expect(component.endDate).toBe(startDayAsTomorrowFilters.endDate);
      });
    });
    it('should filter sessions by existing judge ids', () => {
      sessionFilter.judges = [judgeId];
      computeAndVerifyFilteredSession(component, sessionFilter);
    });
    it('should filter sessions by not existing judge ids', () => {
      sessionFilter.judges = ['not-existing-id'];
      computeAndVerifyFilteredSessionToBeEmptyArray(component, sessionFilter);
    });
    it('should filter sessions by existing room ids', () => {
      sessionFilter.rooms = [roomId];
      computeAndVerifyFilteredSession(component, sessionFilter);
    });
    it('should filter sessions by not existing room ids', () => {
      sessionFilter.rooms = ['not-existing-id'];
      computeAndVerifyFilteredSessionToBeEmptyArray(component, sessionFilter);
    });
    it('should filter sessions by existing session types', () => {
      sessionFilter.sessionTypes = [stubSessionType.code];
      computeAndVerifyFilteredSession(component, sessionFilter);
    });
    it('should filter sessions by not existing session types', () => {
      sessionFilter.sessionTypes = ['not-existing-id'];
      computeAndVerifyFilteredSessionToBeEmptyArray(component, sessionFilter);
    });
    it('should filter sessions by utilization', () => {
      sessionFilter.utilization.fullyListed.active = true;
      computeAndVerifyFilteredSession(component, sessionFilter);
    });
    it('should filter sessions by part listed utilization', () => {
      sessionFilter.utilization.partListed.active = true;
      mockedFullSession[0].hearingParts[0].duration = moment.duration(
        customDuration
      );
      computeAndVerifyFilteredSession(component, sessionFilter);
    });
    it('should filter sessions by over listed utilization', () => {
      sessionFilter.utilization.overListed.active = true;
      mockedFullSession[0].hearingParts[0].duration = moment.duration(
        overListedDuration
      );
      computeAndVerifyFilteredSession(component, sessionFilter);
    });
    it('should filter sessions by unlisted utilization', () => {
      sessionFilter.utilization.unlisted.active = true;
      mockedFullSession[0].hearingParts[0].duration = moment.duration(
        notListedDuration
      );
      computeAndVerifyFilteredSession(component, sessionFilter);
    });
    it('should filter sessions by custom utilization', () => {
      sessionFilter.utilization.custom = {
        active: true,
        from: 45,
        to: 55
      };
      mockedFullSession[0].hearingParts[0].duration = moment.duration(
        customDuration
      );
      computeAndVerifyFilteredSession(component, sessionFilter);
    });
  });

  describe('selectHearing', () => {
    it('should set hearingSelectionModel', () => {
      component.selectHearing(mockedUnlistedHearingVM);
      expect(component.selectedHearing).toEqual(mockedUnlistedHearingVM);
    });
  });

  describe('assignToSessions', () => {
    it('should dispatch AssignToSession action', () => {
      const startTime = '10:30';
      component.selectedSessions = [mockedFullSession[0]];
      component.selectedHearing = mockedUnlistedHearingVM;

      component.assignToSessions({
          confirmed: true,
          startTime: startTime
      } as AssignHearingData);

      const passedObj = storeSpy.calls.first().args[0];
      const sessionAssignmentPayload: HearingToSessionAssignment = passedObj.payload;

      expect(
        passedObj instanceof hearingPartActions.AssignToSession
      ).toBeTruthy();
      expect(sessionAssignmentPayload.hearingId).toEqual(
          mockedUnlistedHearingVM.id
      );
      expect(sessionAssignmentPayload.hearingVersion).toEqual(
          mockedUnlistedHearingVM.version
      );
      expect(sessionAssignmentPayload.userTransactionId).toBeDefined();
      expect(sessionAssignmentPayload.sessionsData[0].sessionId).toEqual(
        mockedFullSession[0].id
      );
      expect(sessionAssignmentPayload.sessionsData[0].sessionVersion).toEqual(
          mockedFullSession[0].version
      )

      expect(sessionAssignmentPayload.start).toEqual(moment(startTime, 'HH:mm').toDate());
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
        component.selectHearing(mockedUnlistedHearingVM);
        component.selectSession(mockedFullSession);
        expect(component.assignButtonEnabled()).toEqual(true);
      });
    });
    describe('when either hearingSelectionModel is not null or selectedSessions is not set', () => {
      it('should return false ', () => {
        component.selectSession([]);
        component.selectHearing(mockedUnlistedHearingVM);
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

// Helpers

function computeAndVerifyFilteredSession(
  sessionSearchComponent: SessionsListingsSearchComponent,
  sessionFilter: SessionFilters
): void {
  const expectedFilteredSessions = sessionSearchComponent.filterSessions(
    mockedFullSession,
    sessionFilter
  );
  expect(mockedFullSession).toEqual(expectedFilteredSessions);
}

function computeAndVerifyFilteredSessionToBeEmptyArray(
  sessionSearchComponent: SessionsListingsSearchComponent,
  sessionFilter: SessionFilters
): void {
  const filteredSessions = sessionSearchComponent.filterSessions(
    mockedFullSession,
    sessionFilter
  );
  expect(filteredSessions).toEqual([]);
}

function defaultFullMockedSession(): SessionViewModel {
  return {
    id: 'some-session-id',
    start: nowMoment,
    duration: sessionDuration,
    room: mockedRooms[0],
    person: mockedJudges[0],
    sessionType: stubSessionType,
    hearingParts: mockedListedHearingPartsVM,
    jurisdiction: 'some jurisdiction',
    version: 1,
    allocated: moment.duration('PT30M'),
    utilization: 100,
    available: moment.duration('PT0M'),
    notes: []
  };
}

function defaultSessionFilter(): SessionFilters {
  return {
    sessionTypes: [],
    rooms: [],
    judges: [],
    startDate: moment(),
    endDate: moment().add(2, 'day'),
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
