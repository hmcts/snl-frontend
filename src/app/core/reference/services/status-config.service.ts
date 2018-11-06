import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { fromResponse, StatusConfigEntry, StatusConfigEntryResponse } from '../models/status-config.model';
import { AppConfig } from '../../../app.config';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map, tap } from 'rxjs/operators';
import { Status } from '../models/status.model';

@Injectable()
export class StatusConfigService {

    private statusConfigSource: BehaviorSubject<StatusConfigEntry[]> = new BehaviorSubject<StatusConfigEntry[]>([]);

    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {}

    fetchStatusConfig(): Observable<StatusConfigEntry[]> {
        return this.http
            .get<StatusConfigEntryResponse[]>(`${this.config.getApiUrl()}/status-config`).pipe(
                map(statusConfigEntriesResponse => statusConfigEntriesResponse.map(fromResponse)),
                tap(statusConfigEntries => {this.statusConfigSource.next(statusConfigEntries)}));
    }

    getStatusConfigEntries(): StatusConfigEntry[] {
        return this.statusConfigSource.getValue();
    }

    getStatusConfigEntry(status: Status): StatusConfigEntry {
        const entry = this.getStatusConfigEntries().find(config => config.status === status);
        if (entry === undefined) {
            throw new Error(`Could not find status config entry for status: '${status}'`)
        } else {
            return entry;
        }
    }
}
