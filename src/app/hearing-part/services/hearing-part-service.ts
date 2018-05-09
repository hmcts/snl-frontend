import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../app.config';
import { SessionAssignment } from '../models/session-assignment';
import { HearingPart } from '../models/hearing-part';

@Injectable()
export class HearingPartService {
    constructor(private http: HttpClient, private config: AppConfig) {
    }

    assignToSession(query: SessionAssignment): Observable<HearingPart> {
        return this.http
            .put<HearingPart>(`${this.config.getApiUrl()}/hearing-part/${query.hearingPartId}/relationship/session`,
                {sessionId: query.sessionId})
    }

}
