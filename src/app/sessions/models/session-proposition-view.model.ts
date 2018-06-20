import { Room } from '../../rooms/models/room.model';
import { Judge } from '../../judges/models/judge.model';

export interface SessionPropositionView {
    date: string | Date,
    startTime: string | Date,
    endTime: string | Date,
    availibility: string,
    judge: Judge,
    room: Room
}
