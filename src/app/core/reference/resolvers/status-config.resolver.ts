import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { StatusConfigService } from '../services/status-config.service';
import { StatusConfigEntry } from '../models/status-config.model';
import { BaseResolver } from '../../resolvers/base.resolver';

@Injectable()
export class StatusConfigResolver extends BaseResolver implements Resolve<StatusConfigEntry[]> {

    constructor(private readonly statusConfigService: StatusConfigService) {
        super();
    }

    resolve(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<StatusConfigEntry[]> {

        return this.getOrFetchData(() => this.statusConfigService.fetchStatusConfig(),
            () => Observable.of(this.statusConfigService.getStatusConfigEntries()));
    }
}
