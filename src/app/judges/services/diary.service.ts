import { Injectable } from '@angular/core';
import { Session } from '../../sessions/models/session.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../app.config';
import { DatePipe } from '@angular/common';
import { DiaryLoadParameters } from '../models/diary-load-parameters.model';

@Injectable()
export class DiaryService {

    constructor(private http: HttpClient, private config: AppConfig) {
    }

    getDiarySessions(parameters: DiaryLoadParameters): Observable<Session[]> {
        let fromDate = new DatePipe('en-UK').transform(parameters.startDate, 'dd-MM-yyyy');
        let toDate = new DatePipe('en-UK').transform(parameters.endDate, 'dd-MM-yyyy');
        let username = parameters.judgeUsername; // TODO or maybe use: this.security.currentUser.username;
        return this.http
            .get<Session[]>(`${this.config.getApiUrl()}/sessions/judge-diary?judge=${username}&startDate=${fromDate}&endDate=${toDate}`);
    }

}
