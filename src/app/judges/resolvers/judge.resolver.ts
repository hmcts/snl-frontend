import { Observable } from 'rxjs/Observable';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Judge } from '../models/judge.model';
import { JudgeService } from '../services/judge.service';

@Injectable()
export class JudgeResolver implements Resolve<Judge[]> {
    constructor(private judgeService: JudgeService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any>|Promise<any>|any {
        return this.judgeService.get();
    }
}