import { CreateHearingPartRequest } from '../models/create-hearing-part-request';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../app.config';
import { SessionAssignment } from '../models/session-assignment';
import { map } from 'rxjs/operators';
import { hearingPart, hearingParts } from '../../core/schemas/data.schema';
import { normalize } from 'normalizr';
import { Transaction } from '../../features/transactions/services/transaction-backend.service';
import { HearingPartDeletion } from '../models/hearing-part-deletion';
import { UpdateHearingPartRequest } from '../models/update-hearing-part-request';
import { HearingPartResponse } from '../models/hearing-part-response';

@Injectable()
export class HearingPartService {
    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {
    }

    searchHearingParts(params): Observable<any> {
        return this.http
            .get<HearingPartResponse[]>(`${this.config.getApiUrl()}/hearing-part`, {
              params: new HttpParams({ fromObject: params })
            }).pipe(map(data => {return normalize(data, hearingParts)}))
    }

    getById(id: string): Observable<any> {
        return this.http
            .get<HearingPartResponse>(`${this.config.getApiUrl()}/hearing-part/${id}`)
                .pipe(map(data => {return normalize(data, hearingPart)}));
    }

    assignToSession(query: SessionAssignment): Observable<any> {
        return this.http
            .put<HearingPartResponse>(`${this.config.getApiUrl()}/hearing-part/${query.hearingPartId}`,
                query);
    }

    createListing(query: CreateHearingPartRequest): Observable<Transaction> {
        return this.http
            .put<Transaction>(`${this.config.getApiUrl()}/hearing-part/create`, JSON.stringify(query), {
                headers: {'Content-Type': 'application/json'}
            });
    }

    updateListing(query: UpdateHearingPartRequest): Observable<Transaction> {
        return this.http
            .put<Transaction>(`${this.config.getApiUrl()}/hearing-part/update`, JSON.stringify(query), {
                headers: {'Content-Type': 'application/json'}
            });
    }

    deleteHearingPart(query: HearingPartDeletion): Observable<any> {
        return this.http
            .post<Transaction>(`${this.config.getApiUrl()}/hearing-part/delete`, JSON.stringify(query), {
                headers: {'Content-Type': 'application/json'}
            });
    }

}
