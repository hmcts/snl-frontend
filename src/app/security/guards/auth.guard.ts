import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SecurityService } from '../services/security.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private securityService: SecurityService, private router: Router) {}

    canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this.securityService.isAuthenticated()) {
          console.log("Is authenticated");
          return true;
      } else {
          console.log("Is not authenticated");
          this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url }});
          return false;
      }
    }
}
