import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { JudgeService } from '../services/judge.service';
import { Judge } from '../models/judge.model';
import { BaseResolver } from '../../core/resolvers/base.resolver';

@Injectable()
export class JudgesResolver extends BaseResolver implements Resolve<Judge[]> {

    constructor(private readonly js: JudgeService) {
        super()
    }

    resolve(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Judge[]> {
        return super.getOrFetchData(() => this.js.fetch(), () => this.js.get());
    }
}
