import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Session } from '../models/session.model';
import { SessionQuery, SessionQueryForDates } from '../models/session-query.model';
import { AppConfig } from '../../app.config';
import { SessionCreate } from '../models/session-create.model';
import { DatePipe } from '@angular/common';

@Injectable()
export class SessionsService {
    constructor(private http: HttpClient, private config: AppConfig) {
    }

    searchSessions(query: SessionQuery): Observable<Session[]> {
        return this.http
            .get<Session[]>(`${this.config.getApiUrl()}/sessions?date=${query.date}`)
            .pipe(map(sessions => sessions || []));
    }

    searchSessionsForDates(query: SessionQueryForDates): Observable<Session[]> {
        let fromDate = new DatePipe('en-UK').transform(query.startDate, 'dd-MM-yyyy');
        let toDate = new DatePipe('en-UK').transform(query.endDate, 'dd-MM-yyyy');
        return this.http
            .get<Session[]>(`${this.config.getApiUrl()}/sessions?startDate=${fromDate}&endDate=${toDate}`)
            .pipe(map(sessions => sessions || []));
    }
  
    createSession(session: SessionCreate): Observable<String> {
      return this.http
        .put<String>(`${this.config.getApiUrl()}/sessions`, session)
    }
}
