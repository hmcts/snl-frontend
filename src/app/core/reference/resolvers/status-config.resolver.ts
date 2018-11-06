import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { StatusConfigService } from '../services/status-config.service';
import { StatusConfigEntry } from '../models/status-config.model';

@Injectable()
export class StatusConfigResolver implements Resolve<StatusConfigEntry[]> {

    constructor(private readonly statusConfigService: StatusConfigService) {}

    resolve(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<StatusConfigEntry[]> {

        if (this.statusConfigService.getStatusConfig().length !== 0) {
            return Observable.of(this.statusConfigService.getStatusConfig());
        } else {
            return this.statusConfigService.fetchStatusConfig();
        }
    }
}
