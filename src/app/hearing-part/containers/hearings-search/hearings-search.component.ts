import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Judge } from '../../../judges/models/judge.model';
import { HearingsFilters } from '../../models/hearings-filter.model';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import { HearingViewmodel } from '../../models/hearing.viewmodel';
import { SearchCriteriaService } from '../../services/search-criteria.service';
import { SearchHearingRequest } from '../../models/search-hearing-request';
import { HearingPartService } from '../../services/hearing-part-service';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material';

@Component({
    selector: 'app-hearings-search',
    templateUrl: './hearings-search.component.html',
    styleUrls: ['./hearings-search.component.scss']
})
export class HearingsSearchComponent {

    judges$: Observable<Judge[]>;
    caseTypes$: Observable<CaseType[]>;
    hearingTypes$: Observable<HearingType[]>;

    filteredHearings: HearingViewmodel[] = [];
    latestFilters: HearingsFilters;
    latestPaging: PageEvent;
    totalCount: number;

    constructor(public hearingPartService: HearingPartService,
                private route: ActivatedRoute,
                public searchCriteriaService: SearchCriteriaService) {
        this.judges$ = this.route.snapshot.data.judges;
        this.caseTypes$ = this.route.snapshot.data.caseTypes;
        this.hearingTypes$ = this.route.snapshot.data.hearingTypes;
    }

    onAmend(hearingId: string) {
        console.log('TODO: Implement going to amendment screen! Id:' + hearingId)
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
        this.hearingPartService.searchHearingViewmodels(this.toSearchHearingRequest(filterValues, pageEvent))
            .subscribe(hearings => {
                this.filteredHearings = hearings.content || [];
                this.totalCount = hearings.totalElements;
            })
    }

    private toSearchHearingRequest(filters: HearingsFilters, pageEvent: PageEvent): SearchHearingRequest {
        if (pageEvent === undefined) {
            pageEvent = {
                pageSize: 10,
                pageIndex: 0
            } as any
        }

        return {
            httpParams: {
                size: pageEvent.pageSize || 10,
                page: pageEvent.pageIndex || 0,
            },
            searchCriteria: this.searchCriteriaService.toSearchCriteria(filters)
        }
    }
}
