import { Observable } from 'rxjs/Observable';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { CaseType } from '../models/case-type';
import { ReferenceDataService } from '../services/reference-data.service';

@Injectable()
export class CaseTypeResolver implements Resolve<CaseType[]> {
    constructor(private referenceDataService: ReferenceDataService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any>|Promise<any>|any {
        return this.referenceDataService.getCaseTypes();
    }
}