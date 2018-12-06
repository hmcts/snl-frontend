import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../app.config';
import { Observable } from 'rxjs/Observable';
import { ActivityLog } from '../models/activity-log.model';

@Injectable()
export class ActivityLogService {
    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {
    }

    getActivitiesForEntity(entityId: string): Observable<ActivityLog[]> {
        return this.http
            .get<ActivityLog[]>(`${this.getUrl()}/${entityId}`)
    }

    private getUrl() {
        return `${this.config.getApiUrl()}/activity-log`;
    }
}
