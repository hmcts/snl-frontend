import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as fromHearingParts from '../../../hearing-part/reducers';
import * as fromJudges from '../../../judges/reducers';
import * as fromReferenceData from '../../../core/reference/reducers';
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as fromHearingPartsActions from '../../../hearing-part/actions/hearing-part.action';
import { Judge } from '../../../judges/models/judge.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { asArray } from '../../../utils/array-utils';
import { HearingPartViewModel } from '../../models/hearing-part.viewmodel';
import { HearingsFilterService } from '../../services/hearings-filter-service';
import { HearingsFilters } from '../../models/hearings-filter.model';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
    selector: 'app-hearings-search',
    templateUrl: './hearings-search.component.html',
    styleUrls: ['./hearings-search.component.scss']
})
export class HearingsSearchComponent implements OnInit {

    hearingParts$: Observable<HearingPartViewModel[]>;
    judges$: Observable<Judge[]>;
    filters$ = new Subject<HearingsFilters>();
    caseTypes$: Observable<CaseType[]>;
    hearingTypes$: Observable<HearingType[]>;
    filteredHearings: HearingPartViewModel[] = [];

    constructor(private readonly store: Store<fromHearingParts.State>,
                private readonly hearingsFilterService: HearingsFilterService,
                public dialog: MatDialog) {
        this.hearingParts$ = this.store.pipe(
            select(fromHearingParts.getFullHearingParts), map(asArray)
        ) as Observable<HearingPartViewModel[]>;
        this.judges$ = this.store.pipe(select(fromJudges.getJudges), map(asArray)) as Observable<Judge[]>;
        this.caseTypes$ = this.store.pipe(select(fromReferenceData.selectCaseTypes));
        this.hearingTypes$ = this.store.pipe(select(fromReferenceData.selectHearingTypes));

        combineLatest(this.hearingParts$, this.filters$, this.filterHearings).subscribe((data) => { this.filteredHearings = data });
    }

    ngOnInit() {
        this.store.dispatch(new JudgeActions.Get());
        this.store.dispatch(new fromHearingPartsActions.Clear());
    }

    filter(filterValues: HearingsFilters) {
        this.store.dispatch(new fromHearingPartsActions.Search());
        this.filters$.next(filterValues);
    }

    filterHearings = (hearings: HearingPartViewModel[], filters: HearingsFilters): HearingPartViewModel[] => {
        if (!filters) {
            return hearings;
        }
        let retVal = hearings
            .filter(h => this.hearingsFilterService.filterByProperty(h.reservedJudge, filters.judges))
            .filter(h => this.hearingsFilterService.filterByPropertyContainsAll(h.priority, filters.priorities))
            .filter(h => this.hearingsFilterService.filterByPropertyContains(h.caseNumber, filters.caseNumber))
            .filter(h => this.hearingsFilterService.filterByPropertyContains(h.caseTitle, filters.caseTitle))
            // .filter(h => this.hearingsFilterService.filterByPropertyContainsAll(
            //     h.communicationFacilitator, filters.communicationFacilitators))
            .filter(h => this.hearingsFilterService.filterByCaseType(h, filters))
            .filter(h => this.hearingsFilterService.filterByHearingType(h, filters));

        return retVal;
    };

}
