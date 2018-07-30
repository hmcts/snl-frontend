import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../app.config';
import { UnlistedHearingReportEntry } from '../model/unlisted-hearing-report-entry';
import { ListedHearingReportEntry } from '../model/listed-hearing-report-entry';
import { getHttpFriendly } from '../../../utils/date-utils';
import * as moment from 'moment'

@Injectable()
export class ReportService {
    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {
    }

    getUnlistedHearingRequests(): Observable<UnlistedHearingReportEntry[]> {
        return this.http
            .get<UnlistedHearingReportEntry[]>(`${this.config.getApiUrl()}/report/unlisted-hearing-requests`)
    }

    getListedHearingRequests(startDate: moment.Moment, endDate: moment.Moment): Observable<ListedHearingReportEntry[]> {
        const start = getHttpFriendly(startDate);
        const end = getHttpFriendly(endDate);

        return this.http
            .get<ListedHearingReportEntry[]>(`${this.config.getApiUrl()}/report/listed-hearing-requests?startDate=${start}&endDate=${end}`)
    }
}
