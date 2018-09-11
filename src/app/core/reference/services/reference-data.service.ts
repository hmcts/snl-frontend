import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../app.config';
import { Observable } from 'rxjs/Observable';
import { CaseType } from '../models/case-type';
import { HearingType } from '../models/hearing-type';
import { RoomType } from '../models/room-type';
import { SessionType } from '../models/session-type';

@Injectable()
export class ReferenceDataService {
    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {
    }

    getCaseTypes(): Observable<CaseType[]> {
        return this.getReferenceDataFor<CaseType[]>('/case-types');
    }

    getHearingTypes(): Observable<HearingType[]> {
        return this.getReferenceDataFor<HearingType[]>('/hearing-types');
    }

    getRoomTypes(): Observable<RoomType[]> {
        return this.getReferenceDataFor<RoomType[]>('/room-types');
    }

    getSessionTypes(): Observable<SessionType[]> {
        return this.getReferenceDataFor<SessionType[]>('/session-types');
    }

    private getReferenceDataFor<T>(urlSuffix: string): Observable<T> {
        return this.http
            .get<T>(`${this.getUrl()}${urlSuffix}`);
    }

    private getUrl() {
        return `${this.config.getApiUrl()}/reference`;
    }
}
