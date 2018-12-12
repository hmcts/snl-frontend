import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../app.config';
import { Observable } from 'rxjs/Observable';
import { ActivityLog, ActivityLogResponse, mapResponseToActivityLog } from '../models/activity-log.model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ActivityLogService {
    activityLogs: Observable<{[id: string]: ActivityLog[]}>;
    private _activityLogs = <BehaviorSubject<{[id: string]: ActivityLog[]}>>new BehaviorSubject({});
    private dataStore: { [id: string]: ActivityLog[] } = {};

    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {
        this.activityLogs = this._activityLogs.asObservable();
    }

    getActivitiesForEntity(entityId: string): void {
        this.http
            .get<ActivityLogResponse[]>(`${this.getUrl()}/${entityId}`)
            .subscribe(activityLogs => {
                this.dataStore[entityId] = activityLogs.map(mapResponseToActivityLog);

                this._activityLogs.next({...this.dataStore})
            })}

    private getUrl() {
        return `${this.config.getApiUrl()}/activity-log`;
    }
}
