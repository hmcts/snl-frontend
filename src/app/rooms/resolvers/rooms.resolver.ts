import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BaseResolver } from '../../core/resolvers/base.resolver';
import { Room } from '../models/room.model';
import { RoomService } from '../services/room.service';

@Injectable()
export class RoomsResolver extends BaseResolver implements Resolve<Room[]> {

    constructor(private readonly roomService: RoomService) {
        super()
    }

    resolve(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Room[]> {
        return this.getOrFetchData(() => this.roomService.fetch(), () => this.roomService.getRooms());
    }
}
