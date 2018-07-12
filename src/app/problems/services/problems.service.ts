import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Problem } from '../models/problem.model';
import { AppConfig } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { normalize } from 'normalizr';
import { problems } from '../../core/schemas/data.schema';

@Injectable()
export class ProblemsService {

    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {
    }

    get(): Observable<any> {
        return this.http
            .get<Problem[]>(`${this.config.getApiUrl()}/problems`)
            .pipe(map(this.normalizeProblems));
    }

    getForTransaction(id: string | number): Observable<any> {
        return this.http
            .get<Problem[]>(`${this.config.getApiUrl()}/problems/by-user-transaction-id?id=${id}`)
            .pipe(map(this.normalizeProblems));
    }

    private normalizeProblems(problemsData) {
        problemsData = problemsData || [];
        return normalize(problemsData, problems);
    }

}
