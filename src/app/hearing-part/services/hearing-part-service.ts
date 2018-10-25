import { CreateHearingRequest } from '../models/create-hearing-request';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../app.config';
import { HearingPartToSessionAssignment, HearingToSessionAssignment } from '../models/hearing-to-session-assignment';
import { map } from 'rxjs/operators';
import { hearingInfo, hearingPart, hearingParts } from '../../core/schemas/data.schema';
import { normalize } from 'normalizr';
import { Transaction } from '../../features/transactions/services/transaction-backend.service';
import { HearingDeletion } from '../models/hearing-deletion';
import { UpdateHearingRequest } from '../models/update-hearing-request';
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

    getHearingById(id: string): Observable<any> {
        return this.http
            .get<HearingPartResponse>(`${this.config.getApiUrl()}/hearing/${id}`)
                .pipe(map(data => {return normalize(data, hearingInfo)}));
    }

    assignToSession(assignment: HearingToSessionAssignment | HearingPartToSessionAssignment): Observable<any> {
        return this.http
            .put<HearingPartResponse>(this.getSessionAssignmentPath(assignment), assignment);
    }

    createListing(query: CreateHearingRequest): Observable<Transaction> {
        return this.http
            .put<Transaction>(`${this.config.getApiUrl()}/hearing-part/create`, JSON.stringify(query), {
                headers: {'Content-Type': 'application/json'}
            });
    }

    updateListing(query: UpdateHearingRequest): Observable<Transaction> {
        return this.http
            .put<Transaction>(`${this.config.getApiUrl()}/hearing-part/update`, JSON.stringify(query), {
                headers: {'Content-Type': 'application/json'}
            });
    }

    deleteHearing(query: HearingDeletion): Observable<any> {
        return this.http
            .post<Transaction>(`${this.config.getApiUrl()}/hearing-part/delete`, JSON.stringify(query), {
                headers: {'Content-Type': 'application/json'}
            });
    }

    private getSessionAssignmentPath(assignment: HearingToSessionAssignment | HearingPartToSessionAssignment) {
        let path = '';

        let objectKeys: string[] = Object.keys(assignment).map(k => k.toString());
        if (objectKeys.some(key => (key === 'hearingId'))) {
            path = `${this.config.getApiUrl()}/hearing/${(assignment as HearingToSessionAssignment).hearingId}`
        } else if (objectKeys.some(key => (key === 'hearingPartId'))) {
            path = `${this.config.getApiUrl()}/hearing-part/${(assignment as HearingPartToSessionAssignment).hearingPartId}`
        } else {
            throw new Error('Cannot obtain URL for the given Session Assignment object!')
        }

        return path;
    }
}
