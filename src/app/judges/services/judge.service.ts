import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import { Judge } from '../models/judge.model';

@Injectable()
export class JudgeService {

    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {
    }

    get(): Observable<Judge[]> {
        return this.http
            .get<Judge[]>(`${this.config.getApiUrl()}/person?personType=judge`) //  TODO: get it back
            .pipe(map(judges => judges || []));
    }

}
