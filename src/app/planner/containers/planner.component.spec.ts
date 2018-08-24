import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, ActionsSubject } from '@ngrx/store';
import { PlannerComponent } from './planner.component';
import { MatDialog } from '@angular/material';
import { SessionsCreationService } from '../../sessions/services/sessions-creation.service';
import { State } from '../../app.state';
import { HearingPartModificationService } from '../../hearing-part/services/hearing-part-modification-service';
import * as moment from 'moment';
import { SessionQueryForDates } from '../../sessions/models/session-query.model';
import { SearchForDates, UpdateComplete, UpdateFailed } from '../../sessions/actions/session.action';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { TransactionConflicted } from '../../features/transactions/actions/transaction.action';
import { EntityTransaction } from '../../features/transactions/models/transaction-status.model';
import * as sessionReducers from '../../sessions/reducers';

let component: PlannerComponent;
let store: Store<State>;
let storeSpy: jasmine.Spy;

const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
const sessionsCreationServiceSpy = jasmine.createSpyObj(
  'SessionsCreationService',
  ['update']
);
const hearingPartModificationServiceSpy = jasmine.createSpyObj(
  'HearingPartModificationService',
  ['assignHearingPartWithSession']
);
const event = <CustomEvent>{
  detail: {
    event: {
      id: 'some-id',
      resourceId: 'some-string',
      start: moment(),
      end: moment()
    },
    jsEvent: {
      target: {
        getAttribute: () => {}
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
        StoreModule.forFeature('sessions', sessionReducers.reducers),
      ],
      providers: [
        ActionsSubject,
        PlannerComponent,
        {
          provide: SessionsCreationService,
          useValue: sessionsCreationServiceSpy
        },
        {
          provide: HearingPartModificationService,
          useValue: hearingPartModificationServiceSpy
        },
        { provide: MatDialog, useValue: matDialogSpy }
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

    it('should call loadDataForAllJudgesSpy when TransactionConflicted has been dispatched', () => {
      const loadDataForAllJudgesSpy = spyOn(component, 'loadDataForAllJudges');
      const mockEntityTransaction: EntityTransaction = {
        entityId: 'some-transaction-entityId',
        id: 'some-id',
        problemsLoaded: false,
        completed: false,
        conflicted: true
      };
      store.dispatch(new TransactionConflicted(mockEntityTransaction));
      expect(loadDataForAllJudgesSpy).toHaveBeenCalled();
    });

    it('should call openSummaryDialog when Session.UpdateComplete has been dispatched', () => {
        matDialogSpy.open.and.returnValue(openDialogMockObj);

        store.dispatch(new UpdateComplete());
      expect(matDialogSpy.open).toHaveBeenCalled();
    });

    it('should call openCreationFailedDialog when Session.UpdateComplete has been dispatched', () => {
      store.dispatch(new UpdateFailed('error msg'));
      expect(matDialogSpy.open).toHaveBeenCalled();
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
      matDialogSpy.open.and.returnValue({
          afterClosed: (): Observable<boolean> => new Observable(observer => observer.next(true))
      });

      matDialogSpy.open.calls.reset();
      component.drop(event);
      expect(
        hearingPartModificationServiceSpy.assignHearingPartWithSession
      ).toHaveBeenCalled();
      expect(matDialogSpy.open).toHaveBeenCalledTimes(2);
    });
  });
});
