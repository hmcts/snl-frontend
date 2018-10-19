import { Observable } from 'rxjs/Observable';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { ReferenceDataService } from '../services/reference-data.service';
import { HearingType } from '../models/hearing-type';

@Injectable()
export class HearingTypeResolver implements Resolve<HearingType[]> {
    constructor(private referenceDataService: ReferenceDataService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any>|Promise<any>|any {
        return this.referenceDataService.getHearingTypes();
    }
}