import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BaseResolver } from '../../core/resolvers/base.resolver';
import { RoomService } from '../services/room.service';
import { Room } from '../models/room.model';

@Injectable()
export class RoomResolver extends BaseResolver implements Resolve<Room[]> {

    constructor(private readonly rs: RoomService) {
        super()
    }

    resolve(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Room[]> {
        return this.getOrFetchData(() => {return Observable.of([])}, () => this.rs.fetch());
    }
}
