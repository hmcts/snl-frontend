import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Session } from '../../sessions/models/session.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../app.config';
import { SecurityService } from '../../security/services/security.service';
import { DatePipe } from '@angular/common';

@Injectable()
export class DiaryService {

    constructor(private http: HttpClient, private config: AppConfig, private security: SecurityService) {
    }

    getDiarySessions(startDate: DatePipe, endDate: DatePipe): Observable<Session[]> {
        let fromDate = new DatePipe('en-UK').transform(startDate, 'dd-MM-yyyy');
        let toDate = new DatePipe('en-UK').transform(endDate, 'dd-MM-yyyy');
        let username = this.security.currentUser.username;
        return this.http
            .get<Session[]>(`${this.config.getApiUrl()}/sessions/judge-diary?judge=${username}&startDate=${fromDate}&endDate=${toDate}`)
            .pipe(
                map(sessions => sessions || [])
            );
    }

}
