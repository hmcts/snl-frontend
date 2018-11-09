import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ReferenceDataService } from '../services/reference-data.service';
import { BaseResolver } from '../../resolvers/base.resolver';
import { HearingType } from '../models/hearing-type';

@Injectable()
export class HearingTypesResolver extends BaseResolver implements Resolve<HearingType[]> {

    constructor(private readonly rds: ReferenceDataService) {
        super()
    }

    resolve(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<HearingType[]> {
        return super.getOrFetchData(this.rds, 'fetchHearingTypes', 'getHearingTypes');
    }
}
