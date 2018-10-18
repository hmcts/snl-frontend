import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import * as fromHearingParts from '../reducers';
import { HearingViewmodel } from '../models/hearing.viewmodel';
import { Observable } from 'rxjs/Observable';
import { Judge } from '../../judges/models/judge.model';
import { map } from 'rxjs/operators';
import { asArray } from '../../utils/array-utils';
import * as fromReferenceData from '../../core/reference/reducers';
import * as fromJudges from '../../judges/reducers';
import { HearingType } from '../../core/reference/models/hearing-type';
import { CaseType } from '../../core/reference/models/case-type';

@Injectable()
export class StoreService {
    constructor(private readonly store: Store<fromHearingParts.State>) {}

    public getJudges$(): Observable<Judge[]> {
        return this.store.pipe(select(fromJudges.getJudges), map(asArray)) as Observable<Judge[]>;
    }

    public getCaseTypes$(): Observable<CaseType[]> {
        return this.store.pipe(select(fromReferenceData.selectCaseTypes));
    }

    public getHearingTypes$(): Observable<HearingType[]> {
        return this.store.pipe(select(fromReferenceData.selectHearingTypes));
    }

    public getFullHearings$(): Observable<HearingViewmodel[]> {
        return this.store.pipe(select(fromHearingParts.getFullHearings));
    }

    public dispatch(action: Action) {
        this.store.dispatch(action);
    }
}

