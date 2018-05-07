import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Session } from '../models/session.model';
import { SessionQuery } from '../models/session-query.model';
import { AppConfig } from '../../app.config';
import { HttpParamsOptions } from '@angular/common/http/src/params';
import { SessionCreate } from '../models/session-create.model';

@Injectable()
export class SessionsService {

  constructor(private http: HttpClient, private config: AppConfig) {
  }

  searchSessions(query: SessionQuery): Observable<Session[]> {
    return this.http
      .get<Session[]>(`${this.config.getApiUrl()}/sessions?date=${query.date}`) //  TODO: get it back
      .pipe(map(sessions => sessions || []));
  }

    createSession(session: SessionCreate): Observable<String> {
      return this.http
          .put<String>(`${this.config.getApiUrl()}/sessions`, session)
          //.pipe(map(sess => sess));
    }
}
