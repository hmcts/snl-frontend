import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../app.config';
import { Observable } from 'rxjs/Observable';
import { CaseType } from '../models/case-type';
import { HearingType } from '../models/hearing-type';

@Injectable()
export class ReferenceDataService {
    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {
    }

    getCaseTypes(): Observable<CaseType[]> {
        return this.getReferenceDataFor<CaseType[]>('/caseType/all');
    }

    getHearingTypes(): Observable<HearingType[]> {
        return this.getReferenceDataFor<HearingType[]>('/hearingType/all');
    }

    private getReferenceDataFor<T>(urlSuffix: string): Observable<T> {
        return this.http
            .get<T>(`${this.getUrl()}${urlSuffix}`);
    }

    private getUrl() {
        return `${this.config.getApiUrl()}/reference`;
    }
}
