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
            .pipe(tap((caseTypes) => {this.caseTypesSource.next(caseTypes)}));
    }

    fetchHearingTypes(): Observable<HearingType[]> {
        return this.getReferenceDataFor<HearingType[]>('/hearing-types')
            .pipe(tap((hearingTypes) => {this.hearingTypesSource.next(hearingTypes)}));
    }

    fetchRoomTypes(): Observable<RoomType[]> {
        return this.getReferenceDataFor<RoomType[]>('/room-types')
            .pipe(tap((roomTypes) => {this.roomTypesSource.next(roomTypes)}));
    }

    fetchSessionTypes(): Observable<SessionType[]> {
        return this.getReferenceDataFor<SessionType[]>('/session-types')
            .pipe(tap((sessionTypes) => {this.sessionTypesSource.next(sessionTypes)}));
    }

    getCaseTypes(): Observable<CaseType[]> {
        return this.caseTypesSource.asObservable();
    }

    getHearingTypes(): Observable<HearingType[]> {
        return this.hearingTypesSource.asObservable();
    }

    getRoomTypes(): Observable<RoomType[]> {
        return this.roomTypesSource.asObservable();
    }

    getSessionTypes(): Observable<SessionType[]> {
        return this.sessionTypesSource.asObservable();
    }

    private getReferenceDataFor<T>(urlSuffix: string): Observable<T> {
        return this.http
            .get<T>(`${this.getUrl()}${urlSuffix}`);
    }

    private getUrl() {
        return `${this.config.getApiUrl()}/reference`;
    }
}
