import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../app.config';
import { SessionAssignment } from '../models/session-assignment';
import { HearingPart } from '../models/hearing-part';
import { map } from 'rxjs/operators';

@Injectable()
export class HearingPartService {
    constructor(private http: HttpClient, private config: AppConfig) {
    }

    searchHearingParts(): Observable<HearingPart[]> {
        return this.http
            .get<HearingPart[]>(`${this.config.getApiUrl()}/hearing-part`)
            .pipe(map(hearingParts => hearingParts || []));
    }

    assignToSession(query: SessionAssignment): Observable<HearingPart> {
        return this.http
            .put<HearingPart>(`${this.config.getApiUrl()}/hearing-part/${query.hearingPartId}`,
                {sessionId: query.sessionId})
    }

}
