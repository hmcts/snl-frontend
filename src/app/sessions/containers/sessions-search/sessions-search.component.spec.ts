import { SessionAssignment } from './../../../hearing-part/models/session-assignment';
import { Judge } from './../../../judges/models/judge.model';
import * as sessionReducers from './../../reducers/index';
import { Room } from './../../../rooms/models/room.model';
import { HearingPart } from './../../../hearing-part/models/hearing-part';
import { AngularMaterialModule } from './../../../../angular-material/angular-material.module';
import { Store, StoreModule } from '@ngrx/store';
import { SessionsSearchComponent } from './sessions-search.component';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SessionsStatisticsService } from '../../services/sessions-statistics-service';
import * as fromHearingParts from '../../../hearing-part/reducers/index';
import * as hearingPartActions from '../../../hearing-part/actions/hearing-part.action';
import * as moment from 'moment';
import * as roomActions from '../../../rooms/actions/room.action';
import * as judgeActions from '../../../judges/actions/judge.action';
import * as judgesReducers from '../../../judges/reducers/index';
import * as sessionsActions from '../../actions/session.action';
import { SessionViewModel } from '../../models/session.viewmodel';
import { Session } from '../../models/session.model';
import { SessionFilters } from '../../models/session-filter.model';
import { HearingPartModificationService } from '../../../hearing-part/services/hearing-part-modification-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TransactionDialogComponent } from '../../components/transaction-dialog/transaction-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

let storeSpy: jasmine.Spy;
let component: SessionsSearchComponent;
let store: Store<fromHearingParts.State>;
let mockedFullSession: SessionViewModel[];
const nowMoment = moment();
const now = nowMoment.toDate();
const roomId = 'some-room-id';
const judgeId = 'some-judge-id';
const caseType = 'some-case-type';
const sessionDuration = 30;
const overListedDuration = 31;
const notListedDuration = 0;
const customDuration = 16;
const mockedRooms: Room[] = [{ id: roomId, name: 'some-room-name' }];
const mockedJudges: Judge[] = [{ id: judgeId, name: 'some-judge-name' }];
const mockedHearingParts: HearingPart[] = [
  {
    id: 'some-id',
    session: 'some-session-id',
    caseNumber: 'abc123',
    caseTitle: 'some-case-title',
    caseType: 'some-case-type',
    hearingType: 'some-hearing-type',
    duration: moment.duration(sessionDuration),
    scheduleStart: now,
    scheduleEnd: now
  }
];
const mockedSessions: Session[] = [
  {
    id: 'some-session-id',
    start: nowMoment,
    duration: sessionDuration,
    room: roomId,
    person: judgeId,
    caseType: caseType,
    hearingTypes: ['some-hearingTypes'],
    jurisdiction: 'some jurisdiction',
    version: 0
  }
];

describe('SessionsSearchComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularMaterialModule,
        FormsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('hearingParts', fromHearingParts.reducers),
        StoreModule.forFeature('sessions', sessionReducers.reducers),
        StoreModule.forFeature('judges', judgesReducers.reducers),
        BrowserAnimationsModule
      ],
      providers: [SessionsSearchComponent, SessionsStatisticsService, HearingPartModificationService],
      declarations: [TransactionDialogComponent]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [TransactionDialogComponent]
      }
    });

    mockedFullSession = [defaultFullMockedSession()];
    component = TestBed.get(SessionsSearchComponent);
    store = TestBed.get(Store);
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(component).toBeDefined();
    });
    it('should fetch hearingParts', () => {
      store.dispatch(new hearingPartActions.SearchComplete(mockedHearingParts));
      component.hearingParts$.subscribe(hearingParts => {
        expect(hearingParts).toEqual(mockedHearingParts);
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
      store.dispatch(new hearingPartActions.SearchComplete(mockedHearingParts));
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
    it('should set empty string to selectedHearingPartId', () => {
      expect(component.selectedHearingPartId).toEqual('');
    });
    it('should set selectedSession to empty obj', () => {
      expect(component.selectedSession).toEqual({});
    });
    it('should set filteredSessions to all sessions', () => {
      expect(component.filteredSessions$).toEqual(component.sessions$);
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
        startDayAsTomorrowFilters.startDate = moment()
          .add(1, 'day')
          .toDate();
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
    it('should filter sessions by existing case types', () => {
      sessionFilter.caseTypes = [caseType];
      computeAndVerifyFilteredSession(component, sessionFilter);
    });
    it('should filter sessions by not existing case types', () => {
      sessionFilter.caseTypes = ['not-existing-id'];
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

  describe('selectHearingPart', () => {
    it('should set selectedHearingPartId', () => {
      const expectedHearingPartId = 'some-hp-id';
      component.selectHearingPart(expectedHearingPartId);
      expect(component.selectedHearingPartId).toEqual(expectedHearingPartId);
    });
  });

  describe('assignToSession', () => {
    it('should dispatch AssignToSession action', () => {
      const expectedSelectedHearingPartId = 'some-selected-hearing-part-id';

      component.selectedSession = mockedFullSession[0];
      component.selectedHearingPartId = expectedSelectedHearingPartId;
      component.assignToSession();

      const passedObj = storeSpy.calls.first().args[0];
      const sessionAssignmentPayload: SessionAssignment = passedObj.payload;

      expect(
        passedObj instanceof hearingPartActions.AssignToSession
      ).toBeTruthy();
      expect(sessionAssignmentPayload.hearingPartId).toEqual(
        expectedSelectedHearingPartId
      );
      expect(sessionAssignmentPayload.userTransactionId).toBeDefined();
      expect(sessionAssignmentPayload.sessionId).toEqual(
        mockedFullSession[0].id
      );
      expect(sessionAssignmentPayload.start).toBeNull();
    });
  });

  describe('selectSession', () => {
    it('should set selectSession', () => {
      const expectedSelectedSession = mockedFullSession[0];
      expect(component.selectedSession).toEqual({});
      component.selectSession(expectedSelectedSession);
      expect(component.selectedSession).toEqual(expectedSelectedSession);
    });
  });

  describe('assignButtonEnabled', () => {
    describe('when selectedHearingPartId is not null and selectedSession is set', () => {
      it('should return true ', () => {
        component.selectedSession = mockedFullSession[0];
        component.selectedHearingPartId = 'some id';
        expect(component.assignButtonEnabled()).toEqual(true);
      });
    });
    describe('when either selectedHearingPartId is not null or selectedSession is not set', () => {
      it('should return false ', () => {
        component.selectedSession = {};
        component.selectedHearingPartId = 'some id';
        expect(component.assignButtonEnabled()).toEqual(false);
      });
      it('should return false ', () => {
        component.selectedSession = {};
        component.selectedHearingPartId = '';
        expect(component.assignButtonEnabled()).toEqual(false);
      });
    });
  });
});

// Helpers

function computeAndVerifyFilteredSession(
  sessionSearchComponent: SessionsSearchComponent,
  sessionFilter: SessionFilters
): void {
  const expectedFilteredSessions = sessionSearchComponent.filterSessions(
    mockedFullSession,
    sessionFilter
  );
  expect(mockedFullSession).toEqual(expectedFilteredSessions);
}

function computeAndVerifyFilteredSessionToBeEmptyArray(
  sessionSearchComponent: SessionsSearchComponent,
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
    caseType: caseType,
    hearingParts: [mockedHearingParts[0]],
    jurisdiction: 'some jurisdiction'
  };
}

function defaultSessionFilter(): SessionFilters {
  return {
    caseTypes: [],
    rooms: [],
    judges: [],
    startDate: new Date(),
    endDate: moment()
      .add(2, 'day')
      .toDate(),
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
