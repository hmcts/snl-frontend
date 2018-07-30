import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';

@Injectable()
export class PocService {
    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {
    }

    loadRulesFromDb(): Observable<any> {
        return this.http
            .post<string>(`${this.config.getApiUrl()}/poc/loaddb`, null, {
              headers: {'Content-Type': 'application/json'}});
    }

    inputTime(body): Observable<any> {
        return this.http
            .put<string>(`${this.config.getApiUrl()}/time`, body, {
                headers: {'Content-Type': 'application/json'}});
    }
}
