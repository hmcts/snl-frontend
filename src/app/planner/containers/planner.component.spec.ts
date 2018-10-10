import { SummaryMessageService } from './../services/summary-message.service';
import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, ActionsSubject } from '@ngrx/store';
import { PlannerComponent } from './planner.component';
import { MatDialog } from '@angular/material';
import { SessionsCreationService } from '../../sessions/services/sessions-creation.service';
import { State } from '../../app.state';
import { HearingModificationService } from '../../hearing-part/services/hearing-modification.service';
import * as moment from 'moment';
import { SessionQueryForDates } from '../../sessions/models/session-query.model';
import { SearchForDates } from '../../sessions/actions/session.action';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import * as fromHearingParts from '../../hearing-part/reducers';
import * as notesReducers from '../../notes/reducers';
import * as judgesReducers from '../../judges/reducers';
import * as fromSessions from '../../sessions/reducers';
import * as caseTypeReducers from '../../core/reference/reducers/case-type.reducer';
import * as sessionTypeReducers from '../../core/reference/reducers/session-type.reducer';
import * as hearingTypeReducers from '../../core/reference/reducers/hearing-type.reducer';
import { Priority } from '../../hearing-part/models/priority-model';

let component: PlannerComponent;
let store: Store<State>;
let storeSpy: jasmine.Spy;
let hearingPartId = 'hpid';

const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
const sessionsCreationServiceSpy = jasmine.createSpyObj(
  'SessionsCreationService',
  ['update', 'fetchUpdatedEntities']
);
const hearingPartModificationServiceSpy = jasmine.createSpyObj(
  'HearingModificationService',
  ['assignWithSession']
);
const event = <CustomEvent>{
  detail: {
    event: {
      id: 'some-id',
      resourceId: 'some-string',
      start: moment(),
      end: moment()
    },
    duration: moment.duration({'minutes' : 30}),
    jsEvent: {
      target: {
        getAttribute: () => {return hearingPartId}
      }
    },
    revertFunc: () => {}
  }
};
const openDialogMockObj = {
  afterClosed: (): Observable<boolean> => new Observable(() => {})
};
const sessionQuery: SessionQueryForDates = {
    startDate: moment(),
    endDate: moment().add(1, 'day')
};

describe('PlannerComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('hearingParts', fromHearingParts.reducers),
        StoreModule.forFeature('sessions', fromSessions.reducers),
        StoreModule.forFeature('judges', judgesReducers.reducers),
        StoreModule.forFeature('notes', notesReducers.reducers),
        StoreModule.forFeature('caseTypes', caseTypeReducers.reducer),
        StoreModule.forFeature('sessionTypes', sessionTypeReducers.reducer),
        StoreModule.forFeature('hearingTypes', hearingTypeReducers.reducer)
      ],
      providers: [
        ActionsSubject,
        PlannerComponent,
        {
          provide: SessionsCreationService,
          useValue: sessionsCreationServiceSpy
        },
        {
          provide: HearingModificationService,
          useValue: hearingPartModificationServiceSpy
        },
        { provide: MatDialog, useValue: matDialogSpy },
        SummaryMessageService
      ]
    });

    component = TestBed.get(PlannerComponent);
    store = TestBed.get(Store);
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
  });

  describe('constructor', () => {
    it('should init object', () => {
      expect(component).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('should set view to room', () => {
      component.ngOnInit();
      expect(component.view).toEqual('room');
    });
  });

  describe('loadDataForAllJudges', () => {
    it('should set lastSearchDateRange', () => {
      component.loadDataForAllJudges(sessionQuery);
      expect(component.lastSearchDateRange).toEqual(sessionQuery);
    });

    it('should dispatch [Session] SearchForDates action', () => {
      component.loadDataForAllJudges(sessionQuery);
      const passedObj = storeSpy.calls.argsFor(0)[0];
      expect(passedObj instanceof SearchForDates).toBeTruthy();
      expect(passedObj.payload).toEqual(sessionQuery);
    });

    it('should NOT dispatch [Session] SearchForDates action when query is null', () => {
      component.loadDataForAllJudges(undefined);
      expect(storeSpy).not.toHaveBeenCalled();
    });
  });

  describe('setRoomView', () => {
    it('should set view to room', () => {
      component.setRoomView();
      expect(component.view).toEqual('room');
    });
  });

  describe('setJudgeView', () => {
    it('should set view to room', () => {
      component.setJudgeView();
      expect(component.view).toEqual('judge');
    });
  });

  describe('eventClick', () => {
    it('should not call dialog open when event is type of CustomEvent', () => {
      const mockCustomEvent = new CustomEvent('');
      component.eventClick(mockCustomEvent);
      matDialogSpy.open.calls.reset();
      expect(matDialogSpy.open).not.toHaveBeenCalled();
    });
    it('should call dialog open when event is other type then CustomEvent', () => {
      const mockCustomEvent = {};
      component.eventClick(mockCustomEvent);
      expect(matDialogSpy.open).toHaveBeenCalled();
    });
  });

  describe('eventModifyConfirmationClosed', () => {
    it('should update session when confirmed', () => {
      matDialogSpy.open.and.returnValue(openDialogMockObj);
      component.eventModify(event);
      component.eventModifyConfirmationClosed(true);
      expect(sessionsCreationServiceSpy.update).toHaveBeenCalled();
    });
    it('should revert latest event when declined', () => {
      matDialogSpy.open.and.returnValue(openDialogMockObj);
      const revertFuncSpy = spyOn(event.detail, 'revertFunc');
      component.eventModify(event);
      component.eventModifyConfirmationClosed(false);
      expect(revertFuncSpy).toHaveBeenCalled();
    });
  });

  describe('eventModify', () => {
    it('should open dialog ', () => {
      matDialogSpy.open.and.returnValue(openDialogMockObj);
      component.eventModify(event);
      expect(matDialogSpy.open).toHaveBeenCalled();
    });
  });

  describe('drop', () => {
    it('should open confirmation dialog ', () => {
      matDialogSpy.open.and.returnValue(openDialogMockObj);
      component.drop(event);
      expect(matDialogSpy.open).toHaveBeenCalled();
    });

    it('should assign hearing parts to session when dialog confirmed', () => {
      component.selectedSessionId = 'some-session-id';
      component.sessions = [
          {
              id: 'some-session-id',
              start: undefined,
              duration: undefined,
              room: undefined,
              person: undefined,
              jurisdiction: 'some jurisdiction',
              version: 1,
              sessionType: undefined,
              hearingParts: undefined,
              allocated: undefined,
              utilization: undefined,
              available: undefined,
              notes: []
          }
      ];

      component.hearingParts = [{
          id: hearingPartId,
          session: undefined,
          caseNumber: 'abc123',
          caseTitle: 'some-case-title',
          caseType: 'asd',
          hearingType: 'asd',
          duration: moment.duration(30),
          scheduleStart: moment.now(),
          scheduleEnd: moment.now(),
          version: 2,
          priority: Priority.Low,
          reservedJudgeId: undefined,
          communicationFacilitator: 'interpreter',
          notes: [],
          reservedJudge: undefined
      }
      ]

      matDialogSpy.open.and.returnValue({
          afterClosed: (): Observable<boolean> => new Observable(observer => observer.next(true))
      });

      component.eventModify(event);
      matDialogSpy.open.calls.reset();
      component.drop(event);
      expect(
        hearingPartModificationServiceSpy.assignWithSession
      ).toHaveBeenCalled();
      expect(matDialogSpy.open).toHaveBeenCalledTimes(2);
    });
  });
});
