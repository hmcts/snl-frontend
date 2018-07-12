import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import * as fromHearingParts from '../../../hearing-part/reducers/index';
import * as fromSessions from '../../../sessions/reducers/index';
import { MatDialog } from '@angular/material';
import * as judgeActions from '../../../judges/actions/judge.action';
import * as judgesReducers from '../../../judges/reducers/index';
import { JudgePlannerComponent } from './judge-planner.component';

let store: Store<fromHearingParts.State>;
let storeSpy: jasmine.Spy;
let component: JudgePlannerComponent;

const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

fdescribe('JudgePlannerComponent', () => {
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

  describe('constructor', () => {
    it('should be defined', () => {
      expect(component).toBeDefined();
    });
    it('should set proper config', () => {
        let defaultView = 'timelineWeek';
        let header = {
            left: 'prev,next today',
            center: 'title',
            right: 'timelineDay,timelineWeek,timelineMonth'
        };
        let views = {
            timelineDay: {
                slotDuration: '00:10'
            },
            timelineWeek: {
                slotDuration: '00:30'
            }
        };

        expect(component.defaultView).toEqual(defaultView);
        expect(component.header).toEqual(header);
        expect(component.views).toEqual(views);
    });

    describe('ngOnInit', () => {
      it('should dispatch Judge Get action', () => {
        component.ngOnInit();
        const action = storeSpy.calls.argsFor(0)[0];
        expect(action instanceof judgeActions.Get).toBeTruthy();
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
                func: 'childEventDrop',
                emitter: 'eventDrop'
            }, {
                func: 'childDrop',
                emitter: 'drop'
            }, {
                func: 'childEventMouseOver',
                emitter: 'eventMouseOver'
            }
        ];

      let outputSpy;

      outputs.forEach(output => {
          it(`'${output.func}' then the '${output.emitter}' should be emitted`, () => {
              outputSpy = spyOn(component[output.emitter as any], 'emit');

              component[output.func]('any');

              expect(outputSpy).toHaveBeenCalledWith('any')
          });
      })
    });
  });
});
