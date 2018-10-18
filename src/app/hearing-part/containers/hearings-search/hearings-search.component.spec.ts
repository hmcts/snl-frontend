import { HearingsSearchComponent } from './hearings-search.component';
import { Observable } from 'rxjs/Observable';
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as fromHearingPartsActions from '../../actions/hearing-part.action';
import { DEFAULT_HEARING_FILTERS, HearingsFilters } from '../../models/hearings-filter.model';
import * as fromHearingActions from '../../actions/hearing.action';

let component: HearingsSearchComponent;
let storeService: any;
let searchCriteriaService: any;
let hearingFilters: HearingsFilters;

describe('HearingsSearchComponent', () => {
    beforeEach(() => {
        storeService = jasmine.createSpyObj('storeService',
            ['getCaseTypes$', 'getJudges$', 'getHearingTypes$', 'getFullHearings$', 'dispatch']);
        storeService.getCaseTypes$.and.returnValue(Observable.of([]));
        storeService.getJudges$.and.returnValue(Observable.of([]));
        storeService.getHearingTypes$.and.returnValue(Observable.of([]));
        storeService.getFullHearings$.and.returnValue(Observable.of([]));

        searchCriteriaService = jasmine.createSpyObj('searchCriteriaService', ['toSearchCriteria']);
        searchCriteriaService.toSearchCriteria.and.returnValue(undefined);
        component = new HearingsSearchComponent(storeService, searchCriteriaService);
        hearingFilters = DEFAULT_HEARING_FILTERS;
    });

    describe('When created', () => {
        it('in constructor it should get reference data and full hearings', () => {
            expect(storeService.getCaseTypes$).toHaveBeenCalled();
            expect(storeService.getJudges$).toHaveBeenCalled();
            expect(storeService.getHearingTypes$).toHaveBeenCalled();
            expect(storeService.getFullHearings$).toHaveBeenCalled();
        });

        it('in OnInit it should call Judges and clear hearing parts state', () => {
            component.ngOnInit();

            expect(storeService.dispatch).toHaveBeenCalledWith(new JudgeActions.Get())
            expect(storeService.dispatch).toHaveBeenCalledWith(new fromHearingPartsActions.Clear())
        });
    });

    describe('When filter', () => {
        it('it should clear hearing part state', () => {
            component.filter(hearingFilters);

            expect(storeService.getCaseTypes$).toHaveBeenCalled();
            expect(storeService.getJudges$).toHaveBeenCalled();
            expect(storeService.getHearingTypes$).toHaveBeenCalled();
            expect(storeService.getFullHearings$).toHaveBeenCalled();
        });

        it('it should call for filtered hearings', () => {
            component.filter(hearingFilters);

            expect(storeService.dispatch).toHaveBeenCalledWith(new fromHearingActions.Clear())
            expect(storeService.dispatch).toHaveBeenCalledWith(new fromHearingActions.Search({searchCriteria: undefined}));
        });
    });
});
