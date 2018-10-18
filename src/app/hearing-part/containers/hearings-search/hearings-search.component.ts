import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as fromHearingParts from '../../../hearing-part/reducers';
import * as fromJudges from '../../../judges/reducers';
import * as fromReferenceData from '../../../core/reference/reducers';
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as fromHearingPartsActions from '../../../hearing-part/actions/hearing-part.action';
import * as fromHearingActions from '../../../hearing-part/actions/hearing.action';
import { Judge } from '../../../judges/models/judge.model';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { asArray } from '../../../utils/array-utils';
import { HearingsFilters } from '../../models/hearings-filter.model';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import { HearingViewmodel } from '../../models/hearing.viewmodel';
import { SearchCriteria } from '../../models/search-criteria';
import { HearingsFilterService } from '../../services/hearings-filter-service';

@Component({
    selector: 'app-hearings-search',
    templateUrl: './hearings-search.component.html',
    styleUrls: ['./hearings-search.component.scss']
})
export class HearingsSearchComponent implements OnInit {

    hearings$: Observable<HearingViewmodel[]>;
    judges$: Observable<Judge[]>;
    caseTypes$: Observable<CaseType[]>;
    hearingTypes$: Observable<HearingType[]>;
    filteredHearings: HearingViewmodel[] = [];

    constructor(private readonly store: Store<fromHearingParts.State>,
                public dialog: MatDialog,
                public hfs: HearingsFilterService) {
        this.store.pipe(select(fromHearingParts.getFullHearings)).subscribe(hearings => {
            this.filteredHearings = hearings as HearingViewmodel[]
        }) ;
        this.judges$ = this.store.pipe(select(fromJudges.getJudges), map(asArray)) as Observable<Judge[]>;
        this.caseTypes$ = this.store.pipe(select(fromReferenceData.selectCaseTypes));
        this.hearingTypes$ = this.store.pipe(select(fromReferenceData.selectHearingTypes));
    }

    ngOnInit() {
        this.store.dispatch(new JudgeActions.Get());
        this.store.dispatch(new fromHearingPartsActions.Clear());
    }

    filter(filterValues: HearingsFilters) {
        this.store.dispatch(new fromHearingActions.Clear()); // A nasty hack to avoid hearings piling up
        this.store.dispatch(new fromHearingActions.Search({
            searchCriteria: this.toSearchCriteria(filterValues)
        }))
    }

    toSearchCriteria(filters: HearingsFilters): SearchCriteria[] {
        return this.hfs.toSearchCriteria(filters);
    }

    onAmend(hearingId: string) {
        console.log('TODO: Implement going to amendment screen! Id:' + hearingId)
    }
}
