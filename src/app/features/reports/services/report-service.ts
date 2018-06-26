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
        //return this.fake();
        return this.http
            .get<UnlistedHearingRequest[]>(`${this.config.getApiUrl()}/report/unlisted-hearing-requests`)
    }

    fake(): Observable<UnlistedHearingRequest[]> {
        return Observable.of([
            {
                'minutes': 360,
                'title': 'Require listing in the next 4 weeks',
                'hearings': 6
            },
            {
                'minutes': 360,
                'title': 'Require listing in the next 3 months',
                'hearings': 6
            },
            {
                'minutes': 45,
                'title': 'Require listing beyond the next 3 months',
                'hearings': 1
            },
            {
                'minutes': 0,
                'title': 'Target schedule not provided',
                'hearings': 0
            }
        ])
    }
}
