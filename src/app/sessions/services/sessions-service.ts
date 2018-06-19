import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Session } from '../models/session.model';
import { SessionQuery, SessionQueryForDates } from '../models/session-query.model';
import { AppConfig } from '../../app.config';
import { SessionCreate } from '../models/session-create.model';
import { session, sessions, sessionsWithHearings } from '../../core/schemas/data.schema';
import { normalize, schema } from 'normalizr';
import { DiaryLoadParameters } from '../models/diary-load-parameters.model';
import { getHttpFriendly } from '../../utils/date-utils';
import { TransactionStatuses } from '../../core/services/transaction-backend.service';

@Injectable()
export class SessionsService {
    constructor(private http: HttpClient, private config: AppConfig) {}

    getSession(sessionId: string | String): Observable<any> {
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
        let fromDate = getHttpFriendly(query.startDate);
        let toDate = getHttpFriendly(query.endDate);

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
        .put<String>(`${this.config.getApiUrl()}/sessions`, sessionCreate)
    }

    updateSession(update: any): Observable<any> {
      return this.http
        .put<String>(`${this.config.getApiUrl()}/sessions/update`, update);
    }

    private createJudgeDiaryUrl(parameters: DiaryLoadParameters) {
        return `${this.config.getApiUrl()}` +
                `/sessions/judge-diary` +
                `?judge=${parameters.judgeUsername}` +
                `&startDate=${getHttpFriendly(parameters.startDate)}` +
                `&endDate=${getHttpFriendly(parameters.endDate)}`;
    }
}
