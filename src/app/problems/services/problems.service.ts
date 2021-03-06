import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Problem, ProblemResponse, Page } from '../models/problem.model';
import { AppConfig } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { normalize } from 'normalizr';
import { problems as ProblemSchema } from '../../core/schemas/data.schema';
import * as moment from 'moment';

@Injectable()
export class ProblemsService {

    constructor(private readonly http: HttpClient, private readonly config: AppConfig) { }

    getPaginated(size, page): Observable<Page<Problem>> {
        return this.getProblems(size, page)
            .map((pagedProblemResponse: Page<ProblemResponse>) => {
                const problems: Problem[] = pagedProblemResponse.content.map(problemResponse => {
                    const createdAt = moment(problemResponse.createdAt);
                    return {...problemResponse, createdAt}
                });

                return {... pagedProblemResponse, content: problems}
            })
    }

    get(): Observable<any> {
        return this.getProblems().pipe(map(this.normalizeProblems));
    }

    getForTransaction(id: string | number): Observable<any> {
        return this.http
            .get<Problem[]>(`${this.config.getApiUrl()}/problems/by-user-transaction-id?id=${id}`)
            .pipe(map(this.normalizeProblems));
    }

    private getProblems(size?, page?) {
        let uri = '/problems'
        if (size !== undefined && page !== undefined) {
            uri += `?size=${size}&page=${page}`
        }
        return this.http
            .get<Page<ProblemResponse>>(`${this.config.getApiUrl()}${uri}`)
    }

    private normalizeProblems(problemsData) {
        problemsData = problemsData || [];
        return normalize(problemsData, ProblemSchema);
    }

}
