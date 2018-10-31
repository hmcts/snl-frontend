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
import { MatDialog } from '@angular/material';
import { HearingActions } from '../../models/hearin-actions';

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
  sessions: [SESSION]
} as Hearing

const hearingServiceMock = {
  getById: function (id: string) {
    return Observable.of();
  },
  unlist: () => {},
  hearings: Observable.of([])
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
const openDialogMockObjConfirmed = {
  afterClosed: (): Observable<boolean> => Observable.of(true)
};
const openDialogMockObjDeclined = {
  afterClosed: (): Observable<boolean> => Observable.of(false)
};
const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

let hearingService: HearingService
let hearingServiceGetByIdSpy

describe('ViewHearingComponent', () => {
  let component: ViewHearingComponent;
  let fixture: ComponentFixture<ViewHearingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularMaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: HearingService, useValue: hearingServiceMock },
        { provide: MatDialog, useValue: matDialogSpy }
      ],
      declarations: [
        ViewHearingComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewHearingComponent);
    hearingService = TestBed.get(HearingService)
    hearingServiceGetByIdSpy = spyOn(hearingService, 'getById')
    // hearingServiceUnlist = spyOn(hearingService, 'unlist')
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
      hearingService.hearings = new BehaviorSubject([HEARING])
      component.ngOnInit()
      expect(component.hearing).toEqual(HEARING)
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

  describe('openConfirmationDialog', () => {
    it('Should open dialog', () => {
      matDialogSpy.open.and.returnValue(openDialogMockObjDeclined);
      component.openConfirmationDialog()
      expect(matDialogSpy.open).toHaveBeenCalled()
    })
  });

  describe('onActionChanged', () => {
    it('when call with Unlist action it should open dialog, once confirmed should call unlist', () => {
      matDialogSpy.open.and.returnValue(openDialogMockObjConfirmed);
      component.onActionChanged({ value: HearingActions.Unlist })
      expect(matDialogSpy.open).toHaveBeenCalled()
      expect(hearingServiceGetByIdSpy).toHaveBeenCalled()
    })
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

  it('formatDuration formats duration with minutes', () => {
    const duration = component.formatDuration('PT30M');
    expect(duration).toEqual('30 minutes');
  });
});
