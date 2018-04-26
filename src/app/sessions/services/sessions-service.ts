import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Session } from '../models/session.model';
import { SessionQuery } from '../models/session-query.model';
import { AppConfig } from '../../app.config';

@Injectable()
export class SessionsService {
  constructor(private http: HttpClient, private config: AppConfig) {}

  searchSessions(query: SessionQuery): Observable<Session[]> {
    return this.http
      .get<Session[]>(`${this.config.getApiUrl()}/sessions?date=${query.date}`)
      .pipe(map(sessions => sessions || []));
  }
}
