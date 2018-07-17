import { Get, GetComplete } from '../../../rooms/actions/room.action';
import { RoomPlannerComponent } from './room-planner.component';
import { Store, StoreModule } from '@ngrx/store';
import { State } from '../../../app.state';
import { TestBed } from '@angular/core/testing';
import * as sessionReducers from '../../../sessions/reducers';
import { SearchComplete } from '../../../sessions/actions/session.action';
import { Session } from '../../../sessions/models/session.model';
import * as judgesReducers from '../../../judges/reducers';
import * as fromHearingParts from '../../../hearing-part/reducers';
import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import { Room } from '../../../rooms/models/room.model';

let component: RoomPlannerComponent;
let store: Store<State>;
let storeSpy: jasmine.Spy;

const now = new Date();
const roomId = 'some-room-id';
const judgeId = 'some-judge-id';
const caseType = 'some-case-type';
const sessionDuration = 30;
const mockedRooms: Room[] = [{ id: roomId, name: 'some-room-name' }];
const mockedSessions: Session[] = [
  {
    id: 'some-session-id',
    start: now,
    duration: sessionDuration,
    room: roomId,
    person: judgeId,
    caseType: caseType,
    hearingTypes: [],
    jurisdiction: 'some jurisdiction',
    version: 0
  }
];

let mockedFullSession: SessionViewModel = {
  id: 'some-session-id',
  start: now,
  duration: sessionDuration,
  room: undefined,
  person: undefined,
  caseType: caseType,
  hearingParts: [],
  jurisdiction: 'some jurisdiction'
};

describe('RoomPlannerComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('hearingParts', fromHearingParts.reducers),
        StoreModule.forFeature('sessions', sessionReducers.reducers),
        StoreModule.forFeature('judges', judgesReducers.reducers)
      ],
      providers: [RoomPlannerComponent]
    });

    component = TestBed.get(RoomPlannerComponent);
    store = TestBed.get(Store);
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
  });

  describe('constructor', () => {
    it('should set defaultView', () => {
      expect(component.defaultView).toEqual('timelineWeek');
    });

    it('should set header', () => {
      const expectedHeader = {
        left: 'prev,next today',
        center: 'title',
        right: 'timelineDay,timelineWeek,timelineMonth'
      };
      expect(component.header).toEqual(expectedHeader);
    });

    it('should set views', () => {
      const expectedViews = {
        timelineDay: {
          slotDuration: '00:10'
        },
        timelineWeek: {
          slotDuration: '00:30'
        }
      };
      expect(component.views).toEqual(expectedViews);
    });
  });

  describe('ngOnInit', () => {
    it('should fetch sessions', () => {
      store.dispatch(new SearchComplete(mockedSessions));
      component.ngOnInit();
      component.sessions$.subscribe(session => {
        expect(session).toEqual([mockedFullSession]);
      });
    });

    it('should dispatch [Room] get action', () => {
      component.ngOnInit();
      const passedObj = storeSpy.calls.argsFor(0)[0];
      expect(passedObj instanceof Get).toBeTruthy();
    });
  });

  describe('configureRoomView', () => {
    it('should set dataTransformer', () => {
      component.configureRoomView();
      expect(component.dataTransformer).toBeDefined();
    });

    it('should set columns [Room] get action', () => {
      const expectedColumns = [
        {
          labelText: 'Room',
          field: 'title'
        }
      ];
      component.configureRoomView();
      expect(component.columns).toEqual(expectedColumns);
    });

    it('should create one more resources than available rooms', () => {
      store.dispatch(new GetComplete(mockedRooms));
      component.configureRoomView();
      expect(component.resources.length).toEqual(mockedRooms.length + 1);
    });
  });

  describe('When calling', () => {
    let outputs = [
      {
        func: 'childLoadDataAction',
        emitter: 'loadDataAction'
      },
      {
        func: 'childEventClick',
        emitter: 'eventClick'
      },
      {
        func: 'childEventResize',
        emitter: 'eventResize'
      },
      {
        func: 'childEventDrop',
        emitter: 'eventDrop'
      },
      {
        func: 'childDrop',
        emitter: 'drop'
      },
      {
        func: 'childEventMouseOver',
        emitter: 'eventMouseOver'
      }
    ];

    outputs.forEach(output => {
      it(`'${output.func}' then the '${output.emitter}' should be emitted`, () => {
        let outputSpy = spyOn(component[output.emitter as any], 'emit');

        component[output.func]('any');

        expect(outputSpy).toHaveBeenCalledWith('any');
      });
    });
  });
});
