import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as fromHearingPartsActions from '../../../hearing-part/actions/hearing-part.action';
import * as fromHearingActions from '../../../hearing-part/actions/hearing.action';
import { Judge } from '../../../judges/models/judge.model';
import { HearingsFilters } from '../../models/hearings-filter.model';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import { HearingViewmodel } from '../../models/hearing.viewmodel';
import { SearchCriteriaService } from '../../services/search-criteria.service';
import { SearchHearingRequest } from '../../models/search-hearing-request';
import { StoreService } from '../../services/store-service';

@Component({
    selector: 'app-hearings-search',
    templateUrl: './hearings-search.component.html',
    styleUrls: ['./hearings-search.component.scss']
})
export class HearingsSearchComponent implements OnInit {

    judges$: Observable<Judge[]>;
    caseTypes$: Observable<CaseType[]>;
    hearingTypes$: Observable<HearingType[]>;
    filteredHearings: HearingViewmodel[] = [];

    constructor(public storeService: StoreService,
                public searchCriteriaService: SearchCriteriaService) {
        this.judges$ = this.storeService.getJudges$();
        this.caseTypes$ = this.storeService.getCaseTypes$();
        this.hearingTypes$ = this.storeService.getHearingTypes$();

        this.storeService.getFullHearings$().subscribe((hearings: HearingViewmodel[]) => {
            this.filteredHearings = hearings;
        });
    }

    ngOnInit() {
        this.storeService.dispatch(new JudgeActions.Get());
        this.storeService.dispatch(new fromHearingPartsActions.Clear());
    }

    filter(filterValues: HearingsFilters) {
        this.storeService.dispatch(new fromHearingActions.Clear());
        this.storeService.dispatch(new fromHearingActions.Search(this.toSearchHearingRequest(filterValues)))
    }

    onAmend(hearingId: string) {
        console.log('TODO: Implement going to amendment screen! Id:' + hearingId)
    }

    private toSearchHearingRequest(filters: HearingsFilters): SearchHearingRequest {
        return {
            searchCriteria: this.searchCriteriaService.toSearchCriteria(filters)
        }
    }
}
