import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { StatusConfigEntry } from './status-config.model';
import { AppConfig } from './app.config';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tap } from 'rxjs/operators';
import { Status } from './status.model';

@Injectable()
export class StatusConfigService {

    private statusConfigSource: BehaviorSubject<StatusConfigEntry[]> = new BehaviorSubject<StatusConfigEntry[]>([]);

    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {}

    fetchStatusConfig(): Observable<StatusConfigEntry[]> {
        return this.http
            .get<StatusConfigEntry[]>(`${this.config.getApiUrl()}/status-config`).pipe(
                tap(statusConfig => {this.statusConfigSource.next(statusConfig)}));
    }

    getStatusConfig(): StatusConfigEntry[] {
        return this.statusConfigSource.getValue();
    }

    getStatusConfigEntry(status: Status): StatusConfigEntry {
        const entry = this.getStatusConfig().find(config => config.status === status);
        if (entry === undefined) {
            throw new Error(`Could not find status config entry for status: '${status}'`)
        } else {
            return entry;
        }
    }
}
