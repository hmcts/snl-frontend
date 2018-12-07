import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../app.config';
import { Observable } from 'rxjs/Observable';
import { ActivityLog, ActivityLogResponse, mapResponseToActivityLog } from '../models/activity-log.model';
import { map } from 'rxjs/operators';

@Injectable()
export class ActivityLogService {
    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {
    }

    getActivitiesForEntity(entityId: string): Observable<ActivityLog[]> {
        return this.http
            .get<ActivityLogResponse[]>(`${this.getUrl()}/${entityId}`)
            .pipe(map<ActivityLogResponse[], ActivityLog[]>(activityLogs => {
                return activityLogs.map(mapResponseToActivityLog)
            }));
    }

    private getUrl() {
        return `${this.config.getApiUrl()}/activity-log`;
    }
}
