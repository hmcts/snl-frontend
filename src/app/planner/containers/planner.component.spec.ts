import { SessionCalendarViewModel } from './../../sessions/models/session.viewmodel';
import { HearingType } from './../../core/reference/models/hearing-type';
import { HearingPartViewModel } from './../../hearing-part/models/hearing-part.viewmodel';
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
import { CaseType } from '../../core/reference/models/case-type';
import { EventDrop } from '../../common/ng-fullcalendar/models/event-drop.model';
import { CalendarEventSessionViewModel } from '../types/calendar-event-session-view-model.type';
import { UpdateEventModel } from '../../common/ng-fullcalendar/models/updateEventModel';
import { Status } from '../../core/reference/models/status.model';

let component: PlannerComponent;
let store: Store<State>;
let storeSpy: jasmine.Spy;
let hearingPartId = 'hpid';

const matDialogSpy: jasmine.SpyObj<MatDialog> = jasmine.createSpyObj('MatDialog', ['open']);
const sessionsCreationServiceSpy = jasmine.createSpyObj(
  'SessionsCreationService',
  ['update', 'fetchUpdatedEntities']
);
const hearingPartModificationServiceSpy = jasmine.createSpyObj(
  'HearingModificationService',
  ['assignWithSession']
);

const eventDrop = {
    resourceId: 'some-string',
    jsEvent: {
      target: {
        getAttribute: () =>  hearingPartId
      }
    } as any,
} as EventDrop
const event = new CustomEvent<EventDrop>('some event', { detail: eventDrop });

const sessionCalendarViewModel: SessionCalendarViewModel = {
    room: undefined,
    person: undefined,
    title: '',
    start: moment(),
    end: moment(),
    id: 'someId',
    hearingParts: [],
    sessionType: undefined,
    version: 1,
    startDate: moment(),
    duration: moment.duration(30, 'minutes')
};

const updateEvent: UpdateEventModel<SessionCalendarViewModel> = {
    event: { ...sessionCalendarViewModel, resourceId: 'some:-:id'},
    delta: moment.duration(30, 'minutes'),
    revertFunc: () => { },
    jsEvent: undefined,
    ui: undefined,
    view: undefined,
}

const calendarWithSessionEvent: CalendarEventSessionViewModel = new CustomEvent<UpdateEventModel<SessionCalendarViewModel>>('eventName', {
  detail: updateEvent,
})

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
      component.searchSessions(sessionQuery);
      expect(component.lastSearchDateRange).toEqual(sessionQuery);
    });

    it('should dispatch [Session] SearchForDates action', () => {
      component.searchSessions(sessionQuery);
      const passedObj = storeSpy.calls.argsFor(0)[0];
      expect(passedObj instanceof SearchForDates).toBeTruthy();
      expect(passedObj.payload).toEqual(sessionQuery);
    });

    it('should NOT dispatch [Session] SearchForDates action when query is null', () => {
      component.searchSessions(undefined);
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
    it('should call dialog open when event is other type then CustomEvent', () => {
      const mockCustomEvent: any = {detail: {event: {id: 'some-id'}}};
      component.eventClick(mockCustomEvent);
      expect(matDialogSpy.open).toHaveBeenCalled();
    });

    describe('eventModifyConfirmationClosed', () => {
      it('should update session when confirmed', () => {
        matDialogSpy.open.and.returnValue({ afterClosed: () => Observable.of(true) });
        component.eventModify(calendarWithSessionEvent);
        expect(sessionsCreationServiceSpy.update).toHaveBeenCalled();
      });
      it('should revert latest event when declined', () => {
        matDialogSpy.open.and.returnValue({ afterClosed: () => Observable.of(false) });
        const revertFuncSpy = spyOn(calendarWithSessionEvent.detail, 'revertFunc');
        component.eventModify(calendarWithSessionEvent);
        expect(revertFuncSpy).toHaveBeenCalled();
      });
    });
  });

  describe('eventModify', () => {
    const confirmationMsg = 'Are you sure you want to modify this session?';
    describe('when validation passes', () => {
      it('should open confirmation dialog ', () => {
        matDialogSpy.open.and.returnValue(openDialogMockObj);
        component.eventModify(calendarWithSessionEvent);
        const dialogMsg = matDialogSpy.open.calls.mostRecent().args[1].data.message
        expect(matDialogSpy.open).toHaveBeenCalled();
        expect(dialogMsg).toEqual(confirmationMsg);
      });
    });
  });

  describe('drop', () => {
    it('should open confirmation dialog ', () => {
      component.hearingParts = [{
          id: hearingPartId,
          multiSession: false
      } as HearingPartViewModel];

      matDialogSpy.open.and.returnValue(openDialogMockObj);
      component.drop(event);
      expect(matDialogSpy.open).toHaveBeenCalled();
    });

    it('should not assign hearing part', () => {
      component.hearingParts = [{
          id: hearingPartId,
          multiSession: true,
      } as HearingPartViewModel];

      matDialogSpy.open.and.returnValue({
          afterClosed: (): Observable<boolean> => new Observable(observer => observer.next(true))
      });
      matDialogSpy.open.calls.reset();
      component.drop(event);
      expect(
          hearingPartModificationServiceSpy.assignWithSession
      ).not.toHaveBeenCalled();
      expect(matDialogSpy.open).toHaveBeenCalledTimes(1);
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
          sessionId: undefined,
          hearingId: undefined,
          multiSession: false,
          caseNumber: 'abc123',
          caseTitle: 'some-case-title',
          caseType: { code: 'asd', description: 'asd'} as CaseType,
          hearingType: { code: 'asd', description: 'asd'} as HearingType,
          duration: moment.duration(30),
          start: moment(),
          scheduleStart: moment(),
          scheduleEnd: moment(),
          version: 2,
          priority: Priority.Low,
          reservedJudge: undefined,
          reservedJudgeId: undefined,
          communicationFacilitator: 'interpreter',
          notes: [],
          status: Status.Listed
      }]

      matDialogSpy.open.and.returnValue({
          afterClosed: (): Observable<boolean> => new Observable(observer => observer.next(true))
      });

      matDialogSpy.open.calls.reset();
      component.drop(event);
      expect(
        hearingPartModificationServiceSpy.assignWithSession
      ).toHaveBeenCalled();
      expect(matDialogSpy.open).toHaveBeenCalledTimes(2);
    });
  });
});
