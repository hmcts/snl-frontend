import { async } from '@angular/core/testing';
import { ViewHearingComponent } from './view-hearing.component';
import { Observable } from 'rxjs/Observable';
import { DEFAULT_SCHEDULED_LISTING, Hearing, ScheduledListing } from '../../models/hearing';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { HearingActions } from '../../models/hearing-actions';
import { PossibleHearingActionsService } from '../../services/possible-hearing-actions.service';
import { IPossibleActionConfigs } from '../../models/ipossible-actions';
import { AmendScheduledListing, DEFAULT_AMEND_SCHEDULED_LISTING_DATA } from '../../models/amend-scheduled-listing';

// @ts-ignore is better than defining default format as const we need to pass to every format() call
moment.defaultFormat = 'DD/MM/YYYY';

const HEARING_ID = 'some-id';
const START_DATE = '01/01/2010';
const ISO_START_DATE = '2010-01-01T00:00:00+00:00';
const END_DATE = '12/12/2012';
const ISO_END_DATE = '2012-12-12T00:00:00+00:00';
const HEARING = {
  id: HEARING_ID,
  sessions: []
} as Hearing

const notesPreparerService: any = {
    prepare: function (id: string) {
        return Observable.of();
    }
}

const listingCreateNotesConfiguration: any = {
    getOrCreateNote: function (id: string) {
        return Observable.of();
    }
}

const notesService: any = {
    upsertMany: function (id: string) {
        return Observable.of();
    }
}

const routeMock: any = {
  snapshot: {
    paramMap: {
      get: function (param: string) {
        return HEARING_ID;
      }
    }
  }
}

const locationMock: any = {
  back: () => {}
}

const possibleHearingActionsServiceMock: jasmine.SpyObj<PossibleHearingActionsService> =
  jasmine.createSpyObj('PossibleHearingActionsService', ['mapToHearingPossibleActions', 'handleAction'])

let hearingServiceMock: any
let dialogMock: any

describe('ViewHearingComponent', () => {
  let component: ViewHearingComponent;

  beforeEach(async(() => {
      hearingServiceMock = jasmine.createSpyObj('dialog', ['getById', 'unlist', 'amendScheduledListing']);
      hearingServiceMock.getById.and.returnValue(Observable.of());
      hearingServiceMock = {...hearingServiceMock, hearings: Observable.of([])};
      dialogMock = jasmine.createSpyObj('dialog', ['open']);

      component = new ViewHearingComponent(routeMock, dialogMock, hearingServiceMock,
        notesPreparerService, listingCreateNotesConfiguration, notesService, locationMock, possibleHearingActionsServiceMock);
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
      hearingServiceMock.hearings = new BehaviorSubject([HEARING])
      component.ngOnInit()
      expect(component.hearing).toEqual(HEARING)
    });

    describe('when get hearing from hearing service', () => {
      it('should get possibleActions and get keys from them', () => {
        const expectedKeys = ['Unlist', 'Withdraw']
        const possibleActions = {Unlist: {}, Withdraw: {}} as IPossibleActionConfigs
        possibleHearingActionsServiceMock.mapToHearingPossibleActions.and.returnValue(possibleActions)
        hearingServiceMock.hearings = new BehaviorSubject([HEARING])
        component.ngOnInit()
        expect(possibleHearingActionsServiceMock.mapToHearingPossibleActions).toHaveBeenCalledWith(HEARING)
        expect(component.possibleActions).toEqual(possibleActions)
        expect(component.possibleActionsKeys).toEqual(expectedKeys)
      });
    });

    it('should fetch given hearing part', () => {
       component.ngOnInit()
       expect(hearingServiceMock.getById).toHaveBeenCalled()
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

    describe('when amending a scheduled listing', () => {
        let scheduledListing: ScheduledListing;
        let startTime = '12:00';

        beforeEach(() => {
            scheduledListing = {
                ...DEFAULT_SCHEDULED_LISTING,
                hearingPartIdOfCurrentHearing: 'hpid',
                hearingPartVersionOfCurrentHearing: 0,
                hearingPartStartTime: moment()
            }
        });

        it('and dialog returns "undefined" service is not called', () => {
            dialogMock.open.and.returnValue({afterClosed: () => Observable.of(undefined)});

            component.openAmendDialog(scheduledListing);

            expect(hearingServiceMock.getById).not.toHaveBeenCalled()
        });

        it('and dialog returns data then service is called and entity is not fetched after rollback', () => {
            dialogMock.open.and.returnValues(
                {afterClosed: () => Observable.of({...DEFAULT_AMEND_SCHEDULED_LISTING_DATA, startTime: startTime})},
                {afterClosed: () => Observable.of(false)});

            component.openAmendDialog(scheduledListing);

            // @ts-ignore jasmine typeings are broken and jasmine.anything() does not match all types as it should
            let expectedAmendScheduledListing: AmendScheduledListing = {
                userTransactionId: jasmine.anything(),
                hearingPartId: scheduledListing.hearingPartIdOfCurrentHearing,
                hearingPartVersion: scheduledListing.hearingPartVersionOfCurrentHearing,
                startTime: startTime
            }
            expect(hearingServiceMock.amendScheduledListing).toHaveBeenCalledWith(expectedAmendScheduledListing)
            expect(hearingServiceMock.getById).not.toHaveBeenCalled()
        });

        it('and dialog returns data then service is called and entity is fetched after commit', () => {
            dialogMock.open.and.returnValues(
                {afterClosed: () => Observable.of({...DEFAULT_AMEND_SCHEDULED_LISTING_DATA, startTime: startTime})},
                {afterClosed: () => Observable.of(true)});

            component.openAmendDialog(scheduledListing);

            // @ts-ignore jasmine typeings are broken and jasmine.anything() does not match all types as it should
            let expectedAmendScheduledListing: AmendScheduledListing = {
                userTransactionId: jasmine.anything(),
                hearingPartId: scheduledListing.hearingPartIdOfCurrentHearing,
                hearingPartVersion: scheduledListing.hearingPartVersionOfCurrentHearing,
                startTime: startTime
            }
            expect(hearingServiceMock.amendScheduledListing).toHaveBeenCalledWith(expectedAmendScheduledListing)
            expect(hearingServiceMock.getById).toHaveBeenCalled()
        });
    });
});
