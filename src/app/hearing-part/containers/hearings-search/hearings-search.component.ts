import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Judge } from '../../../judges/models/judge.model';
import { HearingsFilters } from '../../models/hearings-filter.model';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import { SearchCriteriaService } from '../../services/search-criteria.service';
import { SearchHearingRequest } from '../../models/search-hearing-request';
import { HearingPartService } from '../../services/hearing-part-service';
import { PageEvent } from '@angular/material';
import { ReferenceDataService } from '../../../core/reference/services/reference-data.service';
import { JudgeService } from '../../../judges/services/judge.service';
import { FilteredHearingViewmodel } from '../../models/filtered-hearing-viewmodel';

@Component({
    selector: 'app-hearings-search',
    templateUrl: './hearings-search.component.html',
    styleUrls: ['./hearings-search.component.scss']
})
export class HearingsSearchComponent implements OnInit {

    public static DEFAULT_PAGING: PageEvent = {
        pageSize: 10,
        pageIndex: 0,
        length: undefined
    };

    judges$: Observable<Judge[]>;
    caseTypes$: Observable<CaseType[]>;
    hearingTypes$: Observable<HearingType[]>;

    filteredHearings: FilteredHearingViewmodel[] = [];
    latestFilters: HearingsFilters;
    latestPaging = HearingsSearchComponent.DEFAULT_PAGING;
    totalCount: number;

    constructor(private hearingPartService: HearingPartService,
                private referenceDataService: ReferenceDataService,
                private judgeService: JudgeService,
                private searchCriteriaService: SearchCriteriaService) {
    }

    ngOnInit() {
        this.judges$ = this.judgeService.get();
        this.caseTypes$ = this.referenceDataService.fetchCaseTypes();
        this.hearingTypes$ = this.referenceDataService.fetchHearingTypes();
    }

    onAmend(hearingId: string) {
        // 'TODO: Implement going to amendment screen!
    }

    onNextPage(pageEvent: PageEvent) {
        this.latestPaging = pageEvent;
        this.fetchHearings(this.latestFilters, pageEvent);
    }

    onFilter(filterValues: HearingsFilters) {
        this.latestFilters = filterValues;
        this.fetchHearings(filterValues, this.latestPaging)
    }

    private fetchHearings(filterValues: HearingsFilters, pageEvent: PageEvent) {
        this.hearingPartService.seearchFilteredHearingViewmodels(this.toSearchHearingRequest(filterValues, pageEvent))
            .subscribe(hearings => {
                this.filteredHearings = hearings.content || [];
                this.totalCount = hearings.totalElements;
            })
    }

    private toSearchHearingRequest(filters: HearingsFilters, pageEvent: PageEvent): SearchHearingRequest {
        return {
            httpParams: {
                size: pageEvent.pageSize,
                page: pageEvent.pageIndex,
            },
            searchCriteria: this.searchCriteriaService.toSearchCriteria(filters)
        }
    }
}
