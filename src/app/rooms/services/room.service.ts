import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import { Room } from '../models/room.model';
import { normalize } from 'normalizr';
import { rooms } from '../schemas/room.schema';

@Injectable()
export class RoomService {

    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {
    }

    fetch(): Observable<any> {
        return this.http
            .get<Room[]>(`${this.config.getApiUrl()}/room`);
    }

    get(): Observable<any> {
        return this.http
            .get<Room[]>(`${this.config.getApiUrl()}/room`) //  TODO: get it back
            .pipe(map(data => normalize(data, rooms)));
    }

}
