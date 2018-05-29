import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../app.config';

@Injectable()
export class PocService {
    constructor(private http: HttpClient, private config: AppConfig) {
    }

    loadRulesFromDb(): Observable<any> {
        return this.http
            .post<String>(`${this.config.getApiUrl()}/poc/loaddb`, null, {
              headers: {'Content-Type': 'application/json'}});
    }

    inputTime(body): Observable<any> {
        return this.http
            .put<String>(`${this.config.getApiUrl()}/time`, body, {
                headers: {'Content-Type': 'application/json'}});
    }
}
