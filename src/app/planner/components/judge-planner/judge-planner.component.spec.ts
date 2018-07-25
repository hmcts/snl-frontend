import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import * as fromHearingParts from '../../../hearing-part/reducers';
import * as fromSessions from '../../../sessions/reducers';
import { MatDialog } from '@angular/material';
import * as judgeActions from '../../../judges/actions/judge.action';
import * as judgesReducers from '../../../judges/reducers';
import { JudgePlannerComponent } from './judge-planner.component';
import { Judge } from '../../../judges/models/judge.model';

let store: Store<fromHearingParts.State>;
let storeSpy: jasmine.Spy;
let component: JudgePlannerComponent;

const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

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
        let judge = component.resources.find(r => r.id === 'person-judge-id');
        expect(judge).toBeDefined()
      });
      it('the first resource should be for the "not allocated" slot', () => {
          store.dispatch(new judgeActions.GetComplete(mockedJudges));
          component.configureJudgeView();
          let judge = component.resources.find(r => r.id === 'person-empty');
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

      outputs.forEach(output => {
          it(`'${output.func}' then the '${output.emitter}' should be emitted`, () => {
              let outputSpy = spyOn(component[output.emitter as any], 'emit');

              component[output.func]('any');

              expect(outputSpy).toHaveBeenCalledWith('any')
          });
      })
    });
  });
});
