import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewHearingComponent } from './view-hearing.component';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { ActivatedRoute } from '@angular/router';
import { HearingService } from '../../services/hearing.service';
import { Observable } from 'rxjs/Observable';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Hearing, Session } from '../../models/hearing';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { HearingActions } from '../../models/hearing-actions';
import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ListingCreateNotesConfiguration } from '../../../hearing-part/models/listing-create-notes-configuration.model';
import { NotesService } from '../../../notes/services/notes.service';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { DurationFormatPipe } from '../../../core/pipes/duration-format.pipe';
import { Status } from '../../../core/reference/models/status.model';
import { PossibleHearingActionsService } from '../../services/possible-hearing-actions.service';
import { IPossibleActionConfigs } from '../../models/ipossible-actions';

// @ts-ignore is better than defining default format as const we need to pass to every format() call
moment.defaultFormat = 'DD/MM/YYYY';

const HEARING_ID = 'some-id';
const START_DATE = '01/01/2010';
const ISO_START_DATE = '2010-01-01T00:00:00+00:00';
const END_DATE = '12/12/2012';
const ISO_END_DATE = '2012-12-12T00:00:00+00:00';
const SESSION = { } as Session
const HEARING = {
  id: HEARING_ID,
  sessions: []
} as Hearing

const HEARING_WITH_SESSIONS = {
  id: HEARING_ID,
  sessions: [SESSION],
  status: Status.Listed
} as Hearing

const hearingServiceMock = {
  getById: function (id: string) {
    return Observable.of();
  },
  unlist: () => {},
  hearings: Observable.of([])
}

const notesPreparerService = {
    prepare: function (id: string) {
        return Observable.of();
    }
}

const listingCreateNotesConfiguration = {
    getOrCreateNote: function (id: string) {
        return Observable.of();
    }
}

const notesService = {
    upsertMany: function (id: string) {
        return Observable.of();
    }
}

const routeMock = {
  snapshot: {
    paramMap: {
      get: function (param: string) {
        return HEARING_ID;
      }
    }
  }
}

const possibleHearingActionsServiceMock: jasmine.SpyObj<PossibleHearingActionsService> =
  jasmine.createSpyObj('PossibleHearingActionsService', ['mapToHearingPossibleActions', 'handleAction'])

let hearingService: HearingService
let hearingServiceGetByIdSpy

describe('ViewHearingComponent', () => {
  let component: ViewHearingComponent;
  let fixture: ComponentFixture<ViewHearingComponent>;

  beforeEach(async(() => {
    TestBed.overrideComponent(ViewHearingComponent, {
      set: {
        providers: [{ provide: PossibleHearingActionsService, useValue: possibleHearingActionsServiceMock }]
      }
    });

    TestBed.configureTestingModule({
      imports: [
        AngularMaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: HearingService, useValue: hearingServiceMock },
        { provide: NotesPreparerService, useValue: notesPreparerService},
        { provide: ListingCreateNotesConfiguration, useValue: listingCreateNotesConfiguration},
        { provide: NotesService, useValue: notesService},
        { provide: Location, useValue: () => {} },
      ],
      declarations: [
        ViewHearingComponent,
        DurationFormatPipe
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewHearingComponent);
    hearingService = TestBed.get(HearingService)
    hearingServiceGetByIdSpy = spyOn(hearingService, 'getById')
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set hearingId', () => {
      component.ngOnInit()
      expect(component.hearingId).toEqual(HEARING_ID)
    });

    it('should get hearing from hearing service', () => {
      possibleHearingActionsServiceMock.mapToHearingPossibleActions.and.returnValue({})
      hearingService.hearings = new BehaviorSubject([HEARING])
      component.ngOnInit()
      expect(component.hearing).toEqual(HEARING)
    });

    describe('when get hearing from hearing service', () => {
      it('should get possibleActions and get keys from them', () => {
        const expectedKeys = ['Unlist', 'Withdraw']
        const possibleActions = {Unlist: {}, Withdraw: {}} as IPossibleActionConfigs
        possibleHearingActionsServiceMock.mapToHearingPossibleActions.and.returnValue(possibleActions)
        hearingService.hearings = new BehaviorSubject([HEARING])
        component.ngOnInit()
        expect(possibleHearingActionsServiceMock.mapToHearingPossibleActions).toHaveBeenCalledWith(HEARING)
        expect(component.possibleActions).toEqual(possibleActions)
        expect(component.possibleActionsKeys).toEqual(expectedKeys)
      });
    });

    it('should fetch given hearing part', () => {
       component.ngOnInit()
       expect(hearingServiceGetByIdSpy).toHaveBeenCalled()
    })
  });

  describe('isListed', () => {
    it('should return true if hearing have hearing parts that are assigned to session', () => {
      component.hearing = HEARING_WITH_SESSIONS
      expect(component.isListed()).toBeTruthy()
    })

    it('should return false if hearing have not hearing parts that are assigned to session', () => {
      component.hearing = HEARING
      expect(component.isListed()).toBeFalsy()
    })
  });

  describe('onActionChanged', () => {
    it('should call PossibleHearingActionsService.handleAction', () => {
      component.actionSelect = jasmine.createSpyObj('MatSelect', ['writeValue'])
      component.hearing = HEARING
      const expectedValue = HearingActions.Unlist

      component.onActionChanged({ value: expectedValue })

      expect(possibleHearingActionsServiceMock.handleAction).toHaveBeenCalledWith(expectedValue, HEARING)
    });
  });

  it('getBetween returns proper AFTER period', () => {
    component.ngOnInit()

    component.hearing = {
      scheduleStart: ISO_START_DATE,
      scheduleEnd: null
    } as Hearing;

    expect(component.getListBetween()).toEqual('after ' + START_DATE);
  });

  it('getBetween returns proper BEFORE period', () => {
    component.hearing = {
      scheduleStart: null,
      scheduleEnd: ISO_END_DATE
    } as Hearing;

    expect(component.getListBetween()).toEqual('before ' + END_DATE);
  });

  it('getBetween returns proper FULL period', () => {
    component.hearing = {
      scheduleStart: ISO_START_DATE,
      scheduleEnd: ISO_END_DATE
    } as Hearing;

    expect(component.getListBetween()).toEqual( START_DATE + ' - ' + END_DATE);
  });

  it('getBetween returns proper NULL period', () => {
    component.hearing = {
      scheduleStart: null,
      scheduleEnd: null
    } as Hearing;

    expect(component.getListBetween()).toEqual('');
  });

  it('formatDuration formats duration to HHmm', () => {
    const duration = component.formatDuration('PT30M');
    expect(duration).toEqual('00:30');
  });
});
