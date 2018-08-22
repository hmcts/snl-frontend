import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../app.config';
import { SessionAssignment } from '../models/session-assignment';
import { HearingPart } from '../models/hearing-part';
import { map } from 'rxjs/operators';
import { hearingParts } from '../../core/schemas/data.schema';
import { normalize } from 'normalizr';
import * as moment from 'moment';

@Injectable()
export class HearingPartService {
    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {
    }

    searchHearingParts(params): Observable<any> {
        return this.http
            .get<HearingPart[]>(`${this.config.getApiUrl()}/hearing-part`, {
              params: new HttpParams({ fromObject: params })
            })
          .pipe(map(data => data.map(hp => {
              hp.scheduleEnd = moment(hp.scheduleEnd);
              hp.scheduleStart = moment(hp.scheduleStart);
              hp.duration = moment.duration(hp.duration);
              return hp;
          })),
              map(data => {return normalize(data, hearingParts)}));

    }

    assignToSession(query: SessionAssignment): Observable<any> {
        return this.http
            .put<HearingPart>(`${this.config.getApiUrl()}/hearing-part/${query.hearingPartId}`,
                query);
    }

    createListing(query: HearingPart): Observable<string> {
        return this.http
            .put<string>(`${this.config.getApiUrl()}/hearing-part`, JSON.stringify(query), {
                headers: {'Content-Type': 'application/json'}
            });
    }

}
