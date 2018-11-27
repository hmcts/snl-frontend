import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import { Room } from '../models/room.model';
import { normalize } from 'normalizr';
import { rooms } from '../schemas/room.schema';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class RoomService {
    private source: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>([]);
    private rooms$: Observable<Room[]> = this.source.asObservable();

    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {
    }

    getRooms(): Observable<Room[]> {
        return this.rooms$;
    }

    fetch(): Observable<Room[]> {
        return this.http
            .get<Room[]>(`${this.config.getApiUrl()}/room`)
            .pipe(tap(fetchedRooms => {this.source.next(fetchedRooms)}));
    }

    /**
     * @deprecated When we will move to non ngrx approach it will be removed.
     */
    get(): Observable<any> {
        return this.fetch().pipe(map(data => normalize(data, rooms)));
    }
}
