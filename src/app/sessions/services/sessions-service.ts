import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Session } from '../models/session.model';
import { SessionQuery, SessionQueryForDates } from '../models/session-query.model';
import { AppConfig } from '../../app.config';
import { SessionCreate } from '../models/session-create.model';
import { DatePipe } from '@angular/common';
import { sessions } from '../schemas/session.schema';
import { normalize, schema } from 'normalizr';
import { DiaryLoadParameters } from '../models/diary-load-parameters.model';

@Injectable()
export class SessionsService {
    constructor(private http: HttpClient, private config: AppConfig) {
    }

    searchSessions(query: SessionQuery): Observable<any> {
        return this.http
            .get<Session[]>(`${this.config.getApiUrl()}/sessions?date=${query.date}`)
            .pipe(map(data => {return normalize(data, sessions)}));
    }

    searchSessionsForDates(query: SessionQueryForDates): Observable<any> {
        let fromDate = new DatePipe('en-UK').transform(query.startDate, 'dd-MM-yyyy');
        let toDate = new DatePipe('en-UK').transform(query.endDate, 'dd-MM-yyyy');
        return this.http
            .get<Session[]>(`${this.config.getApiUrl()}/sessions?startDate=${fromDate}&endDate=${toDate}`)
            .pipe(map(data => {return normalize(data, sessions)}));
    }

    searchSessionsForJudge(parameters: DiaryLoadParameters): Observable<any> {
        let fromDate = new DatePipe('en-UK').transform(parameters.startDate, 'dd-MM-yyyy');
        let toDate = new DatePipe('en-UK').transform(parameters.endDate, 'dd-MM-yyyy');
        let username = parameters.judgeUsername; // TODO or maybe use: this.security.currentUser.username;
        return this.http
            .get<Session[]>(`${this.config.getApiUrl()}/sessions/judge-diary?judge=${username}&startDate=${fromDate}&endDate=${toDate}`)
            .pipe(map(data => {return normalize(data, sessions)}));
    }

    createSession(session: SessionCreate): Observable<String> {
      return this.http
        .put<String>(`${this.config.getApiUrl()}/sessions`, session)
    }
}
