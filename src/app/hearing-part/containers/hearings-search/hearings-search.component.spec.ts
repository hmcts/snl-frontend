import { Judge } from '../../../judges/models/judge.model';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { Store, StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import * as fromHearingParts from '../../../hearing-part/reducers';
import * as moment from 'moment';
import * as hearingPartActions from '../../../hearing-part/actions/hearing-part.action';
import * as judgeActions from '../../../judges/actions/judge.action';
import * as referenceDataActions from '../../../core/reference/actions/reference-data.action';
import * as caseTypeReducers from '../../../core/reference/reducers/case-type.reducer';
import * as hearingTypeReducers from '../../../core/reference/reducers/hearing-type.reducer';
import * as judgesReducers from '../../../judges/reducers';
import * as notesReducers from '../../../notes/reducers';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HearingPartViewModel } from '../../models/hearing-part.viewmodel';
import { Priority } from '../../models/priority-model';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import { HearingsSearchComponent } from './hearings-search.component';
import { SessionsStatisticsService } from '../../../sessions/services/sessions-statistics-service';
import { HearingsFilterService } from '../../services/hearings-filter-service';
import { HearingsFilters } from '../../models/hearings-filter.model';
import { HearingPartResponse } from '../../models/hearing-part-response';
import { Note } from '../../../notes/models/note.model';
import { HearingModificationService } from '../../services/hearing-modification.service';

let storeSpy: jasmine.Spy;
let component: HearingsSearchComponent;
let store: Store<fromHearingParts.State>;
let mockedFullHearings: HearingPartViewModel[];
const nowMoment = moment();
const nowISOSting = nowMoment.toISOString();
const judgeId = 'some-judge-id';
const stubCaseType = {code: 'some-case-type-code', description: 'some-case-type'} as CaseType;
const stubCaseTypes = [stubCaseType];
const stubHearingType = {code: 'some-hearing-type-code', description: 'some-hearing-type'} as HearingType;
const stubHearingTypes = [stubHearingType];
const durationStringFormat = 'PT30M';
const mockedJudges: Judge[] = [{ id: judgeId, name: 'some-judge-name' }];
const mockedNotes: Note[] = [
    {
        id: 'note-id',
        content: 'nice content',
        type: 'Facility Requirements',
        entityId: 'some-id',
        entityType: 'ListingRequest',
        createdAt: undefined,
        modifiedBy: undefined
    }];

const mockedHearingPartResponse: HearingPartResponse = {
  id: 'some-hp-id',
  sessionId: undefined,
  // caseNumber: 'abc123',
  // caseTitle: 'some-case-title',
  // caseTypeCode: stubCaseType.code,
  // hearingTypeCode: stubHearingType.code,
  // duration: durationStringFormat,
  // scheduleStart: nowISOSting,
  // scheduleEnd: nowISOSting,
  version: 2,
  // priority: Priority.Low,
  // reservedJudgeId: judgeId,
  // communicationFacilitator: 'interpreter',
  // deleted: false
  hearingInfo: 'some-h-id'
};

const mockedUnlistedHearingPartVM: HearingPartViewModel = {
    id: 'some-h-id',
    sessionId: undefined,
    caseNumber: 'abc123',
    caseTitle: 'some-case-title',
    caseType: stubCaseType,
    hearingType: stubHearingType,
    duration: moment.duration(durationStringFormat),
    scheduleStart: moment(nowISOSting),
    scheduleEnd: moment(nowISOSting),
    version: 2,
    priority: Priority.Low,
    reservedJudgeId: judgeId,
    communicationFacilitator: 'interpreter',
    notes: mockedNotes,
    reservedJudge: mockedJudges[0],
    hearingId: 'some-hp-id'
};

// same as unlisted, but with session set to matching id in Session
let mockedListedHearingPartVM: HearingPartViewModel = { ...mockedUnlistedHearingPartVM, sessionId: 'some-session-id' };
let mockedListedHearingPart: HearingPartResponse = { ...mockedHearingPartResponse, sessionId: 'some-session-id' };
const mockedListedHearingPartResponses: HearingPartResponse[] = [mockedListedHearingPart];

describe('HearingsSearchComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularMaterialModule,
        FormsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('hearingParts', fromHearingParts.reducers),
        StoreModule.forFeature('judges', judgesReducers.reducers),
        StoreModule.forFeature('notes', notesReducers.reducers),
        StoreModule.forFeature('caseTypes', caseTypeReducers.reducer),
        StoreModule.forFeature('hearingTypes', hearingTypeReducers.reducer),
        BrowserAnimationsModule
      ],
      providers: [HearingsSearchComponent, SessionsStatisticsService, HearingModificationService, HearingsFilterService],
      declarations: [TransactionDialogComponent]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [TransactionDialogComponent]
      }
    });

    mockedFullHearings = [mockedListedHearingPartVM];
    component = TestBed.get(HearingsSearchComponent);
    store = TestBed.get(Store);
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(component).toBeDefined();
    });
    it('should fetch filter data', () => {
      store.dispatch(new referenceDataActions.GetAllCaseTypeComplete(stubCaseTypes));
      store.dispatch(new referenceDataActions.GetAllHearingTypeComplete(stubHearingTypes));
      store.dispatch(new judgeActions.GetComplete(mockedJudges));

      component.hearings$.subscribe(hearingParts => {
        expect(hearingParts).toEqual([]);
      });

      expect(component.filteredHearings).toEqual([]);
    });

    it('should fetch judges', () => {
      store.dispatch(new judgeActions.GetComplete(mockedJudges));
      component.judges$.subscribe(judges => {
        expect(judges).toEqual(mockedJudges);
      });
    });

    it('should fetch full sessions', () => {
      store.dispatch(new hearingPartActions.SearchComplete(mockedListedHearingPartResponses));
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should dispatch [JudgeActions] Get action', () => {
      component.ngOnInit();
      const passedObj = storeSpy.calls.argsFor(0)[0];
      expect(passedObj instanceof judgeActions.Get).toBeTruthy();
    });

    it('should dispatch [HearingParts] Clear action', () => {
      component.ngOnInit();
      const passedObj = storeSpy.calls.argsFor(1)[0];
      expect(passedObj instanceof hearingPartActions.Clear).toBeTruthy();
    });
  });

  describe('filterHearings', () => {
    let hearingsFilter: HearingsFilters;
    beforeEach(() => {
      hearingsFilter = defaultHearingsFilter();
    });

    it('should filter sessions by existing judge ids', () => {
      hearingsFilter.judges = [judgeId];
      computeAndVerifyFilteredHearings(component, hearingsFilter);
    });
    it('should filter sessions by not existing judge ids', () => {
      hearingsFilter.judges = ['not-existing-id'];
      computeAndVerifyFilteredHearingsToBeEmptyArray(component, hearingsFilter);
    });

    it('should filter sessions by existing case types', () => {
      hearingsFilter.caseTypes = [stubCaseType.code];
      computeAndVerifyFilteredHearings(component, hearingsFilter);
    });

    it('should filter sessions by not existing case types', () => {
      hearingsFilter.caseTypes = ['not-existing-id'];
      computeAndVerifyFilteredHearingsToBeEmptyArray(component, hearingsFilter);
    });

    it('should filter sessions by existing hearing types', () => {
      hearingsFilter.hearingTypes = [stubHearingType.code];
      computeAndVerifyFilteredHearings(component, hearingsFilter);
    });

    it('should filter sessions by not existing hearing types', () => {
      hearingsFilter.hearingTypes = ['not-existing-id'];
      computeAndVerifyFilteredHearingsToBeEmptyArray(component, hearingsFilter);
    });

    // // TODO add similar all and listed when ready
    // it('should filter sessions by unlisted listingDetail', () => {
    //   hearingsFilter.listingDetails = 'unlisted';
    //   mockedFullHearings = [mockedListedHearingPartVM, mockedUnlistedHearingPartVM];
    //   const filteredHearings = component.filterHearings(
    //       mockedFullHearings,
    //       hearingsFilter
    //   );
    //   expect(filteredHearings).toEqual([mockedUnlistedHearingPartVM]);
    // });

  });

  describe('toSearchCriteria', () => {
     it('should return ...', () => {
        let filters = {
            caseNumber: '',
            caseTitle: '',
            priorities: [],
            caseTypes: [],
            hearingTypes: [],
            communicationFacilitators: [],
            judges: [],
            listingDetails: 'all',
        } as HearingsFilters;
     });
  });
});

// Helpers
// TODO have a closer look, as these seem to be currently wrongly implemented (not really checking filtering)
function computeAndVerifyFilteredHearings(
  hearingsSearchComponent: HearingsSearchComponent,
  filter: HearingsFilters
): void {
  const expectedFilteredHearings = hearingsSearchComponent.filterHearings(
    mockedFullHearings,
    filter
  );
  expect(mockedFullHearings).toEqual(expectedFilteredHearings);
}

function computeAndVerifyFilteredHearingsToBeEmptyArray(
    hearingsSearchComponent: HearingsSearchComponent,
    filter: HearingsFilters
): void {
    const expectedFilteredHearings = hearingsSearchComponent.filterHearings(
        mockedFullHearings,
        filter
    );
  expect(expectedFilteredHearings).toEqual([]);
}

function defaultHearingsFilter(): HearingsFilters {
  return {
      caseNumber: '',
      caseTitle: '',
      priorities: [],
      caseTypes: [],
      hearingTypes: [],
      communicationFacilitators: [],
      judges: [],
      listingDetails: ''
  } as HearingsFilters;
}
