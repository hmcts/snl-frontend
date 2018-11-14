import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../app.config';
import { ReloadStatusResponse } from '../../models/rules-engine/reload-status-response';

@Injectable()
export class RulesEngineService {
    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {
    }

    getStatus(): Observable<ReloadStatusResponse[]> {
        return this.http
            .get<ReloadStatusResponse[]>(`${this.config.getApiUrl()}/rules/status`);
  }
}
