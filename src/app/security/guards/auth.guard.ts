import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly securityService: SecurityService, private readonly router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
                if (this.securityService.isAuthenticated()) {
                    return true;
                } else {
                    this.router.navigate([ '/auth/login' ], { queryParams: { returnUrl: state.url } });
                    return false;
                }
    }
}
