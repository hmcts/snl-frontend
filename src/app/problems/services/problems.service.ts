import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Problem } from '../models/problem.model';
import { AppConfig } from '../../app.config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProblemsService {

    constructor(private http: HttpClient, private config: AppConfig) {
    }

    get(): Observable<Problem[]> {
        return this.http
            .get<Problem[]>(`${this.config.getApiUrl()}/problems`)
            .pipe(map(problems => problems || []));
    }

    getForEntity(id: string | number | String): Observable<Problem[]> {
        return this.http
            .get<Problem[]>(`${this.config.getApiUrl()}/problems/by-entity-id?id=${id}`)
            .pipe(map(problems => problems || []));
    }



}
