import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { StatusConfigService } from './status-config.service';
import { StatusConfigEntry } from './status-config.model';
import { mergeMap, tap } from 'rxjs/operators';

@Injectable()
export class StatusConfigResolver implements Resolve<StatusConfigEntry[]> {

    constructor(private readonly statusConfigService: StatusConfigService) {}

    resolve(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<StatusConfigEntry[]> {

        if (this.statusConfigService.getStatusConfig().length !== 0) {
            return Observable.of(this.statusConfigService.getStatusConfig());
        } else {
            return this.statusConfigService.fetchStatusConfig()
                .pipe(tap(console.log), mergeMap(() => {
                    return Observable.of(this.statusConfigService.getStatusConfig());
                }));
        }
    }
}
