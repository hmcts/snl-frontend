import { HearingPartViewModel } from './../../../hearing-part/models/hearing-part.viewmodel';
import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import * as fromHearingParts from '../../../hearing-part/reducers';
import * as fromSessions from '../../../sessions/reducers';
import { MatDialog } from '@angular/material';
import * as judgeActions from '../../../judges/actions/judge.action';
import * as judgesReducers from '../../../judges/reducers';
import { JudgePlannerComponent } from './judge-planner.component';
import { Judge } from '../../../judges/models/judge.model';
import { Separator } from '../../../core/callendar/transformers/data-with-simple-resource-transformer';
import { SessionCalendarViewModel } from '../../../sessions/models/session.viewmodel';
import * as moment from 'moment';
import { UpdateEventModel } from '../../../common/ng-fullcalendar/models/updateEventModel';
import { CalendarEventSessionViewModel } from '../../types/calendar-event-session-view-model.type';
import { Observable } from 'rxjs';

let store: Store<fromHearingParts.State>;
let storeSpy: jasmine.Spy;
let component: JudgePlannerComponent;
const matDialogSpy: jasmine.SpyObj<MatDialog> = jasmine.createSpyObj('MatDialog', ['open']);
const mockedJudges: Judge[] = [{ id: 'judge-id', name: 'some-judge-name' }];

describe('JudgePlannerComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('hearingParts', fromHearingParts.reducers),
        StoreModule.forFeature('sessions', fromSessions.reducers),
        StoreModule.forFeature('judges', judgesReducers.reducers)
      ],
      providers: [
        JudgePlannerComponent,
        { provide: MatDialog, useValue: matDialogSpy }
      ]
    });

    component = TestBed.get(JudgePlannerComponent);
    store = TestBed.get(Store);
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
  });

  describe('When creating the component', () => {
    it('it should be defined', () => {
      expect(component).toBeDefined();
    });
    it('proper config values should be set', () => {
        expect(component.defaultView).toBeDefined();
        expect(component.header).toBeDefined();
        expect(component.views).toBeDefined();
    });

    describe('When calling ngOnInit', () => {
      it('the Judge Get action should be dispatched', () => {
        component.ngOnInit();
        const action = storeSpy.calls.argsFor(0)[0];
        expect(action instanceof judgeActions.Get).toBeTruthy();
      });
    });

    describe('When configuring the view', () => {
      it('the resources should be generated person-wise', () => {
        store.dispatch(new judgeActions.GetComplete(mockedJudges));
        component.configureJudgeView();
        let judge = component.resources.find(r => r.id === `person${Separator}judge-id`);
        expect(judge).toBeDefined()
      });
      it('the first resource should be for the "not allocated" slot', () => {
          store.dispatch(new judgeActions.GetComplete(mockedJudges));
          component.configureJudgeView();
          let judge = component.resources.find(r => r.id === `person${Separator}empty`);
          expect(judge).toBeDefined()
      });
    });

    describe('When calling', () => {
      let outputs = [
            {
                func: 'childLoadDataAction',
                emitter: 'loadDataAction'
            }, {
                func: 'childEventClick',
                emitter: 'eventClick'
            }, {
                func: 'childEventResize',
                emitter: 'eventResize'
            }, {
                func: 'childDrop',
                emitter: 'drop'
            }, {
                func: 'childEventMouseOver',
                emitter: 'eventMouseOver'
            }
        ];

      outputs.forEach(output => {
          it(`'${output.func}' then the '${output.emitter}' should be emitted`, () => {
              let outputSpy = spyOn(component[output.emitter as any], 'emit');

              component[output.func]('any');

              expect(outputSpy).toHaveBeenCalledWith('any')
          });
      })
    });

    describe('childEventDrop', () => {
      const sessionCalendarViewModel: SessionCalendarViewModel = {
        room: undefined,
        person: undefined,
        title: '',
        start: moment(),
        end: moment(),
        id: 'someId',
        hearingParts: [{multiSession: true} as HearingPartViewModel],
        sessionType: undefined,
        version: 1,
      };

      const updateEvent: UpdateEventModel<SessionCalendarViewModel> = {
        event: sessionCalendarViewModel,
        delta: moment.duration(30, 'minutes'),
        revertFunc: () => { },
        jsEvent: undefined,
        ui: undefined,
        view: undefined,
      }

      beforeEach(() => {
        matDialogSpy.open.calls.reset()
        matDialogSpy.open.and.returnValue({afterClosed: () => Observable.of()})
      });

      describe('when session contains multi session hearing part and is dropped to row with different judge', () => {
        it('should NOT emit an event and open the dialog', () => {
          updateEvent.event.person = {id: 'someId'} as Judge;
          updateEvent.event.resourceId = `some${Separator}OtherJudgeId`

          const calendarWithSessionEvent: CalendarEventSessionViewModel = new CustomEvent<UpdateEventModel<SessionCalendarViewModel>>(
            'eventName', {
            detail: updateEvent,
          });

          let emitSpy = spyOn(component.eventDrop, 'emit');

          component.childEventDrop(calendarWithSessionEvent)

          expect(emitSpy).not.toHaveBeenCalledWith(calendarWithSessionEvent)
          expect(matDialogSpy.open).toHaveBeenCalled()
        });
      });

      describe('when session contains multi session hearing part and is dropped to row with the same judge', () => {
        xit('should emit an event when and not open the dialog', () => {
          const judgeId = 'theSameId'
          updateEvent.event.person = {id: judgeId} as Judge;
          updateEvent.event.resourceId = `some${Separator}${judgeId}`

          const calendarWithSessionEvent: CalendarEventSessionViewModel = new CustomEvent<UpdateEventModel<SessionCalendarViewModel>>(
            'eventName', {
            detail: updateEvent,
          });

          let emitSpy = spyOn(component.eventDrop, 'emit');

          component.childEventDrop(calendarWithSessionEvent)

          expect(emitSpy).toHaveBeenCalledWith(calendarWithSessionEvent)
          expect(matDialogSpy.open).not.toHaveBeenCalled()
        });
      });
    });
  });
});
