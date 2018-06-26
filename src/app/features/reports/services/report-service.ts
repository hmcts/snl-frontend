import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../app.config';
import { UnlistedHearingRequest } from '../model/unlisted-hearings/unlisted-hearing-request';

@Injectable()
export class ReportService {
    constructor(private http: HttpClient, private config: AppConfig) {
    }

    getUnlistedHearingRequests(): Observable<UnlistedHearingRequest[]> {
        return this.http
            .get<UnlistedHearingRequest[]>(`${this.config.getApiUrl()}/report/unlisted-hearing-requests`)
    }
}
