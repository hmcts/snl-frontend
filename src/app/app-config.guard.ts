import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from './app.config';

@Injectable()
export class AppConfigGuard implements CanActivate {

    constructor(private readonly appConfig: AppConfig) {}

    canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.appConfig.load()
          .then(() => true);
    }
}
