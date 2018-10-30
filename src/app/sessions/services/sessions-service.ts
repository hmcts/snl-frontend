import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Session } from '../models/session.model';
import { SessionQuery, SessionQueryForDates } from '../models/session-query.model';
import { AppConfig } from '../../app.config';
import { SessionCreate } from '../models/session-create.model';
import { session, sessions, sessionsWithHearings } from '../../core/schemas/data.schema';
import { normalize } from 'normalizr';
import { DiaryLoadParameters } from '../models/diary-load-parameters.model';
import { getHttpFriendly } from '../../utils/date-utils';
import { SessionAmmend } from '../models/ammend/session-ammend.model';

@Injectable()
export class SessionsService {
    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {}

    getSession(sessionId: string): Observable<any> {
        return this.http
            .get<Session>(`${this.config.getApiUrl()}/sessions/${sessionId}`)
            .pipe(map(data => {return normalize(data, session)}));
    }

    searchSessions(query: SessionQuery): Observable<any> {
        return this.http
            .get<Session[]>(`${this.config.getApiUrl()}/sessions?date=${query.date}`)
            .pipe(map(data => {return normalize(data, sessions)}));
    }

    searchSessionsForDates(query: SessionQueryForDates): Observable<any> {
        const fromDate = getHttpFriendly(query.startDate);
        const toDate = getHttpFriendly(query.endDate);

        return this.http
            .get<Session[]>(`${this.config.getApiUrl()}/sessions?startDate=${fromDate}&endDate=${toDate}`)
            .pipe(map(data => { let normalized = normalize(data, sessionsWithHearings); console.log(normalized); return normalized }));
    }

    searchSessionsForJudge(parameters: DiaryLoadParameters): Observable<any> {
        return this.http
            .get<Session[]>(this.createJudgeDiaryUrl(parameters))
            .pipe(map(data => {return normalize(data, sessions)}));
    }

    searchSessionsForJudgeWithHearings(parameters: DiaryLoadParameters): Observable<any> {
        return this.http
            .get<Session[]>(this.createJudgeDiaryUrl(parameters))
            .pipe(map(data => { return normalize(data, sessionsWithHearings) }));
    }

    createSession(sessionCreate: SessionCreate): Observable<any> {
      return this.http
        .put<string>(`${this.config.getApiUrl()}/sessions`, sessionCreate)
    }

    amendSession(sessionAmend: SessionAmmend): Observable<any> {
      return this.http
        .post<string>(`${this.config.getApiUrl()}/sessions/amend`, sessionAmend)
    }

    /**
     * @param update - should contain {version: number} and other elements
     * @returns {Observable<any>}
     */
    updateSession(update: any, version: number): Observable<any> {
        update.version = version;
        return this.http
            .put<string>(`${this.config.getApiUrl()}/sessions/update`, update);
    }

    private createJudgeDiaryUrl(parameters: DiaryLoadParameters) {
        return `${this.config.getApiUrl()}` +
                `/sessions/judge-diary` +
                `?judge=${parameters.judgeUsername}` +
                `&startDate=${getHttpFriendly(parameters.startDate)}` +
                `&endDate=${getHttpFriendly(parameters.endDate)}`;
    }
}
