import { Room } from '../../rooms/models/room.model';
import { Judge } from '../../judges/models/judge.model';

export interface SessionPropositionView {
    date: string,
    startTime: string,
    endTime: string,
    availibility: string,
    judge: Judge,
    room: Room
}
