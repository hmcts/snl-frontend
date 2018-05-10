import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../app.config';
import { Observable } from 'rxjs/Observable';
import { ListingCreate } from '../models/listing-create';

@Injectable()
export class HearingPartService {

    constructor(private http: HttpClient, private config: AppConfig) {
    }

    createListing(query: ListingCreate): Observable<String> {
        return this.http
            .put<String>(`${this.config.getApiUrl()}/hearing-part`, JSON.stringify(query), {
                headers: {'Content-Type': 'application/json'}
            });
    }

}
