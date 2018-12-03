import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ReferenceDataService } from '../services/reference-data.service';
import { BaseResolver } from '../../resolvers/base.resolver';
import { SessionType } from '../models/session-type';

@Injectable()
export class SessionTypesResolver extends BaseResolver implements Resolve<SessionType[]> {

    constructor(private readonly rds: ReferenceDataService) {
        super()
    }

    resolve(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SessionType[]> {
        return this.getOrFetchData(() => this.rds.fetchSessionTypes(), () => this.rds.getSessionTypes());
    }
}
