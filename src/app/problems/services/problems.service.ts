import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, tap} from 'rxjs/operators';
import { Problem } from '../models/problem.model';
import { AppConfig } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { normalize } from 'normalizr';
import { problems } from '../../core/schemas/data.schema';

@Injectable()
export class ProblemsService {

    constructor(private http: HttpClient, private config: AppConfig) {
    }

    get(): Observable<any> {
        return this.http
            .get<Problem[]>(`${this.config.getApiUrl()}/problems`)
            .pipe(map(this.normalizeProblems));
    }

    getForEntity(id: string | number | String): Observable<any> {
        return this.http
            .get<Problem[]>(`${this.config.getApiUrl()}/problems/by-entity-id?id=${id}`)
            .pipe(map(this.normalizeProblems), tap(console.log));
    }

    private normalizeProblems(problemsData) {
        problemsData = problemsData || [];
        return normalize(problemsData, problems);
    }

}
