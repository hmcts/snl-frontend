import { SessionPropositionQuery } from '../../models/session-proposition-query.model';
import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { SessionsPropositionsSearchComponent } from './sessions-propositions-search.component';
import * as fromHearingParts from '../../../hearing-part/reducers';
import { SessionsCreationService } from '../../services/sessions-creation.service';
import * as roomActions from '../../../rooms/actions/room.action';
import { Room } from '../../../rooms/models/room.model';
import { MatDialog } from '@angular/material';
import * as sessionReducers from '../../reducers';
import * as judgeActions from '../../../judges/actions/judge.action';
import * as judgesReducers from '../../../judges/reducers';
import { Judge } from '../../../judges/models/judge.model';
import * as sessionsActions from '../../actions/session.action';
import { SessionProposition } from '../../models/session-proposition.model';
import { SessionPropositionView } from '../../models/session-proposition-view.model';
import * as moment from 'moment';
import { SessionCreate } from '../../models/session-create.model';

let store: Store<fromHearingParts.State>;
let storeSpy: jasmine.Spy;
let component: SessionsPropositionsSearchComponent;

const roomId = 'some-room-id';
const judgeId = 'some-judge-id';
const mockedRooms: Room[] = [{ id: roomId, name: 'some-room-name' }];
const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
const sessionDialogSpy = jasmine.createSpyObj(['close']);
const sessionsCreationServiceSpy = jasmine.createSpyObj(
  'SessionsCreationService',
  ['create']
);
const mockedJudges: Judge[] = [{ id: judgeId, name: 'some-judge-name' }];
const sessionPropositions: SessionProposition[] = [
  { start: moment(), end: moment(), judgeId: judgeId, roomId: roomId }
];
const sessionPropositionViewsMock: SessionPropositionView[] = [
  {
    startTime: moment(sessionPropositions[0].start).format('HH:mm'),
    endTime: moment(sessionPropositions[0].end).format('HH:mm'),
    date: moment(sessionPropositions[0].start).format('DD MMM YYYY'),
    availability: moment
      .duration(
        moment(sessionPropositions[0].end).diff(
          moment(sessionPropositions[0].start)
        )
      )
      .humanize(),
    room: mockedRooms[0],
    judge: mockedJudges[0]
  }
];
const mockedSPV = sessionPropositionViewsMock[0];
const sessionPropositionQuery: SessionPropositionQuery = {
  from: moment(),
  to: moment(),
  durationInMinutes: 0,
  roomId: roomId,
  judgeId: judgeId
};

describe('SessionsPropositionsSearchComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('hearingParts', fromHearingParts.reducers),
        StoreModule.forFeature('sessions', sessionReducers.reducers),
        StoreModule.forFeature('judges', judgesReducers.reducers)
      ],
      providers: [
        SessionsPropositionsSearchComponent,
        {
          provide: SessionsCreationService,
          useValue: sessionsCreationServiceSpy
        },
        { provide: MatDialog, useValue: matDialogSpy }
      ]
    });

    component = TestBed.get(SessionsPropositionsSearchComponent);
    store = TestBed.get(Store);
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(component).toBeDefined();
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
    it('should fetch sessionPropositions', () => {
      store.dispatch(new roomActions.GetComplete(mockedRooms));
      store.dispatch(new judgeActions.GetComplete(mockedJudges));
      store.dispatch(new sessionsActions.AddPropositions(sessionPropositions));
      component.sessionPropositions$.subscribe(sessionPropositionsViews => {
        expect(sessionPropositionsViews).toEqual(sessionPropositionViewsMock);
      });
    });
    it('should fetch sessionPropositionsLoading', () => {
      store.dispatch(new sessionsActions.AddPropositions(sessionPropositions));
      component.sessionPropositionsLoading$.subscribe(propositionLoading => {
        expect(propositionLoading).toEqual(false);
      });
    });
    it('should fetch roomsLoading', () => {
      store.dispatch(new roomActions.GetComplete(mockedRooms));
      component.roomsLoading$.subscribe(roomsLoading => {
        expect(roomsLoading).toEqual(false);
      });
    });
    it('should fetch judgesLoading', () => {
      store.dispatch(new judgeActions.GetComplete(mockedJudges));
      component.judgesLoading$.subscribe(judgesLoading => {
        expect(judgesLoading).toEqual(false);
      });
    });
    it('should set filterDataLoading', done => {
      store.dispatch(new roomActions.Get());
      store.dispatch(new judgeActions.GetComplete(mockedJudges));

      component.filterDataLoading$.subscribe(filterDataLoading => {
        expect(filterDataLoading).toEqual(true);
        done();
      });
    });
  });

  describe('ngOnInit', () => {
    it('should dispatch Room Get action', () => {
      component.ngOnInit();
      const action = storeSpy.calls.first().args[0];
      expect(action instanceof roomActions.Get).toBeTruthy();
    });
    it('should dispatch Judge Get action', () => {
      component.ngOnInit();
      const action = storeSpy.calls.argsFor(1)[0];
      expect(action instanceof judgeActions.Get).toBeTruthy();
    });
  });

  describe('search', () => {
    it('should set filterData', () => {
      component.search(sessionPropositionQuery);
      expect(component.filterData).toEqual(sessionPropositionQuery);
    });
    it('should dispatch SearchPropositions session action', () => {
      component.search(sessionPropositionQuery);
      const action = storeSpy.calls.first().args[0];
      expect(action instanceof sessionsActions.SearchPropositions).toBeTruthy();
    });
  });

  describe('onSessionCreate', () => {
    it('should open dialog and pass object with computed values', () => {
      store.dispatch(new roomActions.GetComplete(mockedRooms));
      store.dispatch(new judgeActions.GetComplete(mockedJudges));

      component.onSessionCreate(mockedSPV);
      const passedData = matDialogSpy.open.calls.first().args[1].data;
      const passedSessionData: SessionCreate = passedData.sessionData;
      const expectedStartDate = moment(mockedSPV.date, 'DD MMM YYYY')
        .add(moment.duration(mockedSPV.startTime as string));
      const expectedSessionData = {
        userTransactionId: undefined,
        id: undefined,
        start: expectedStartDate,
        duration: 0,
        roomId: roomId,
        personId: judgeId,
        caseType: undefined
      } as SessionCreate;

      expect(passedData.rooms$).toBe(component.rooms$);
      expect(passedData.judges$).toBe(component.judges$);
      expect(passedSessionData).toEqual(expectedSessionData);
    });

    describe('closeSessionCreateDialog', () => {
      it('should call close() on session dialog', () => {
        matDialogSpy.open.and.returnValue(sessionDialogSpy);
        component.onSessionCreate(mockedSPV);

        component.closeSessionCreateDialog();
        expect(sessionDialogSpy.close).toHaveBeenCalled();
      });
    });

    describe('dialogSessionCreateClicked', () => {
      it('should create session', () => {
        matDialogSpy.open.and.returnValue(sessionDialogSpy);
        component.onSessionCreate(mockedSPV);

        const dummySession: SessionCreate = {
          id: 'some-id',
          userTransactionId: 'some-user-transaction-id',
          personId: 'some-person-id',
          roomId: 'some-room-id',
          duration: 30,
          start: moment(),
          caseType: 'some-case-type',
          sessionTypeCode: 'some-session-type-code'
        };

        component.dialogSessionCreateClicked(dummySession);
        expect(sessionsCreationServiceSpy.create).toHaveBeenCalled();
        expect(sessionsCreationServiceSpy.create.calls.first().args[0]).toBe(
          dummySession
        );
        expect(sessionDialogSpy.close).toHaveBeenCalled();
      });
    });
  });
});
