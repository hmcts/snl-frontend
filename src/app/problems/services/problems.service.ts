import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Problem, ProblemResponse } from '../models/problem.model';
import { AppConfig } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { normalize } from 'normalizr';
import { problems as ProblemSchema } from '../../core/schemas/data.schema';
import * as moment from 'moment';

@Injectable()
export class ProblemsService {

    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {
    }

    getAll(): Observable<Problem[]> {
        return this.getProblems()
            .map(problemResponses => {
                const problems: Problem[] = problemResponses.map(problemResponse => {
                    const createdAt = moment(problemResponse.createdAt);
                    return {...problemResponse, createdAt}
                })
                return problems
            })
    }

    get(): Observable<any> {
        return this.getProblems()
            .pipe(map(this.normalizeProblems));
    }

    getForTransaction(id: string | number): Observable<any> {
        return this.http
            .get<Problem[]>(`${this.config.getApiUrl()}/problems/by-user-transaction-id?id=${id}`)
            .pipe(map(this.normalizeProblems));
    }

    private getProblems() {
        return this.http
            .get<ProblemResponse[]>(`${this.config.getApiUrl()}/problems`)
    }

    private normalizeProblems(problemsData) {
        problemsData = problemsData || [];
        return normalize(problemsData, ProblemSchema);
    }

}
