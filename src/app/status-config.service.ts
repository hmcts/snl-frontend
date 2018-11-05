import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { EMPTY_STATUS_CONFIG, StatusConfig, StatusConfigEntry } from './status-config.model';
import { AppConfig } from './app.config';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tap } from 'rxjs/operators';
import { Status } from './status.model';

@Injectable()
export class StatusConfigService {

    private statusConfigSource: BehaviorSubject<StatusConfig> = new BehaviorSubject<StatusConfig>(EMPTY_STATUS_CONFIG);

    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {}

    fetchStatusConfig(): Observable<StatusConfig> {
        // Call backend for statusConfig and push to statusConfigSource
        this.statusConfigSource.next({entries: [
                {status: Status.LISTED, canBeListed: false, canBeUnlisted: false}
            ]});
        return Observable.of({entries: [
                {status: Status.LISTED, canBeListed: false, canBeUnlisted: false}
            ]})
    }

    getStatusConfig(): StatusConfig {
        return this.statusConfigSource.getValue();
    }

    getStatusConfigEntry(status: Status): StatusConfigEntry {
        const entry = this.getStatusConfig().entries.find(config => config.status === status);
        if (entry === undefined) {
            throw new Error(`Could not find status config entry for status: ${status}.
                Available status config entries: ${this.getStatusConfig().entries}`)
        } else {
            return entry;
        }
    }
}
