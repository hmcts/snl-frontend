import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Session } from "../models/session.model";
import { SessionQuery } from "../models/session-query.model";
import { AppConfig } from "../../app.config";

@Injectable()
export class SessionsService {
  private API_PATH = '/api/get-sessions';

  constructor(private http: HttpClient, private config: AppConfig) {
    this.API_PATH = this.config.getApiUrl();
  }

  searchSessions(query: SessionQuery): Observable<Session[]> {
    return this.http
      .get<Session[]>(`${this.API_PATH}?date=${query.date}`)
      .pipe(map(sessions => sessions || []));
  }
}
