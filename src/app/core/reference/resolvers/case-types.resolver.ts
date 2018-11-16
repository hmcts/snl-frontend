import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CaseType } from '../models/case-type';
import { ReferenceDataService } from '../services/reference-data.service';
import { BaseResolver } from '../../resolvers/base.resolver';

@Injectable()
export class CaseTypesResolver extends BaseResolver implements Resolve<CaseType[]> {

    constructor(private readonly rds: ReferenceDataService) {
        super()
    }

    resolve(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CaseType[]> {
        return this.getOrFetchData(() => this.rds.fetchCaseTypes(), () => this.rds.getCaseTypes());
    }
}
