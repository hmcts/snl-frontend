import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../app.config';
import { Observable } from 'rxjs/Observable';
import { CaseType } from '../models/case-type';
import { HearingType } from '../models/hearing-type';
import { RoomType } from '../models/room-type';
import { SessionType } from '../models/session-type';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tap } from 'rxjs/operators';

@Injectable()
export class ReferenceDataService {

    private caseTypesSource: BehaviorSubject<CaseType[]> = new BehaviorSubject<CaseType[]>([]);
    private hearingTypesSource: BehaviorSubject<HearingType[]> = new BehaviorSubject<HearingType[]>([]);
    private roomTypesSource: BehaviorSubject<RoomType[]> = new BehaviorSubject<RoomType[]>([]);
    private sessionTypesSource: BehaviorSubject<SessionType[]> = new BehaviorSubject<SessionType[]>([]);

    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {}

    fetchCaseTypes(): Observable<CaseType[]> {
        return this.getReferenceDataFor<CaseType[]>('/case-types')
            .pipe(tap(this.caseTypesSource.next));
    }

    fetchHearingTypes(): Observable<HearingType[]> {
        return this.getReferenceDataFor<HearingType[]>('/hearing-types')
            .pipe(tap(this.hearingTypesSource.next));
    }

    fetchRoomTypes(): Observable<RoomType[]> {
        return this.getReferenceDataFor<RoomType[]>('/room-types')
            .pipe(tap(this.roomTypesSource.next));
    }

    fetchSessionTypes(): Observable<SessionType[]> {
        return this.getReferenceDataFor<SessionType[]>('/session-types')
            .pipe(tap(this.sessionTypesSource.next));
    }

    getCaseTypes(): CaseType[] {
        return this.caseTypesSource.getValue();
    }

    getHearingTypes(): HearingType[] {
        return this.hearingTypesSource.getValue();
    }

    getRoomTypes(): RoomType[] {
        return this.roomTypesSource.getValue();
    }

    getSessionTypes(): SessionType[] {
        return this.sessionTypesSource.getValue();
    }

    private getReferenceDataFor<T>(urlSuffix: string): Observable<T> {
        return this.http
            .get<T>(`${this.getUrl()}${urlSuffix}`);
    }

    private getUrl() {
        return `${this.config.getApiUrl()}/reference`;
    }
}
