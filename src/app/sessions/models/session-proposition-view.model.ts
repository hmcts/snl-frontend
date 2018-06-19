import { Room } from '../../rooms/models/room.model';
import { Judge } from '../../judges/models/judge.model';

export interface SessionPropositionView {
    start: Date,
    end: Date,
    judge: Judge,
    room: Room
}