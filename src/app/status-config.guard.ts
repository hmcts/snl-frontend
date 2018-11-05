import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { StatusConfigService } from './status-config.service';
import { EMPTY_STATUS_CONFIG } from './status-config.model';

@Injectable()
export class StatusConfigGuard implements CanActivate {

    constructor(private readonly statusConfigService: StatusConfigService) {}

    canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.statusConfigService.getStatusConfig() !== EMPTY_STATUS_CONFIG) {
            return true;
        } else {
            return new Promise<void>((resolve) => {
                this.statusConfigService.fetchStatusConfig()
                    .subscribe(() => {
                        resolve();
                    });
            }).then(() => true);
        }
    }
}
