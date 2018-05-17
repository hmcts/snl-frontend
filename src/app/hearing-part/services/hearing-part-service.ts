import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../app.config';
import { SessionAssignment } from '../models/session-assignment';
import { HearingPart } from '../models/hearing-part';
import { map } from 'rxjs/operators';
import { hearingPart, hearingParts } from '../../sessions/schemas/session.schema';
import { normalize } from 'normalizr';
import { ListingCreate } from '../models/listing-create';

@Injectable()
export class HearingPartService {
    constructor(private http: HttpClient, private config: AppConfig) {
    }

    searchHearingParts(): Observable<any> {
        return this.http
            .get<HearingPart[]>(`${this.config.getApiUrl()}/hearing-part`)
            .pipe(map(data => {return normalize(data, hearingParts)}));
    }

    assignToSession(query: SessionAssignment): Observable<any> {
        return this.http
            .put<HearingPart>(`${this.config.getApiUrl()}/hearing-part/${query.hearingPartId}`,
                {sessionId: query.sessionId, start: query.start})
            .pipe(map(data => normalize(data, hearingPart)));
    }

    createListing(query: ListingCreate): Observable<String> {
        return this.http
            .put<String>(`${this.config.getApiUrl()}/hearing-part`, JSON.stringify(query), {
                headers: {'Content-Type': 'application/json'}
            });
    }

}
