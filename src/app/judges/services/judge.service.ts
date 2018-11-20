import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import { Judge } from '../models/judge.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class JudgeService {

    private judgesSource: BehaviorSubject<Judge[]> = new BehaviorSubject<Judge[]>([]);
    private judges$: Observable<Judge[]> = this.judgesSource.asObservable();

    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {}

    get(): Observable<Judge[]> {
        return this.judges$;
    }

    fetch(): Observable<Judge[]> {
        return this.http
            .get<Judge[]>(`${this.config.getApiUrl()}/person?personType=judge`)
            .pipe(tap(judges => {this.judgesSource.next(judges)}));
    }

}
