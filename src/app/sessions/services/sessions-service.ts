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
import { SessionPropositionQuery } from '../models/session-proposition-query.model';

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
            .pipe(map(data => { return normalize(data, sessionsWithHearings) }));
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

    /**
     * @param update - should contain {version: number} and other elements
     * @returns {Observable<any>}
     */
    updateSession(update: any, version: number): Observable<any> {
        update.version = version;
        return this.http
            .put<string>(`${this.config.getApiUrl()}/sessions/update`, update);
    }

    searchSessionPropositions(params: SessionPropositionQuery) {
        return this.http.get( this.createSearchUrl(params) )
    }

    private createJudgeDiaryUrl(parameters: DiaryLoadParameters) {
        return `${this.config.getApiUrl()}` +
                `/sessions/judge-diary` +
                `?judge=${parameters.judgeUsername}` +
                `&startDate=${getHttpFriendly(parameters.startDate)}` +
                `&endDate=${getHttpFriendly(parameters.endDate)}`;
    }

    private createSearchUrl(params: SessionPropositionQuery) {
        const from = params.from.startOf('day').format('YYYY-MM-DD HH:mm');
        const to = params.to.endOf('day').format('YYYY-MM-DD HH:mm');
        const durationInSeconds = params.durationInMinutes * 60;

        let query = `${this.config.getApiUrl()}/search?from=${from}&to=${to}&durationInSeconds=${durationInSeconds}`;

        if (params.roomId !== null && params.roomId !== '') {
            query += `&room=${params.roomId}`;
        }
        if (params.judgeId !== null && params.judgeId !== '') {
            query += `&judge=${params.judgeId}`;
        }

        return query;
    }
}
