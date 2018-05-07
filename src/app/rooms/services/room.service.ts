import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import { Room } from '../models/room.model';

@Injectable()
export class RoomService {

    constructor(private http: HttpClient, private config: AppConfig) {
    }

    get(): Observable<Room[]> {
        return this.http
            .get<Room[]>(`${this.config.getApiUrl()}/room`) //  TODO: get it back
            .pipe(map(rooms => rooms || []));
    }

}
