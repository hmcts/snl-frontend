import { Room } from '../../rooms/models/room.model';
import { Judge } from '../../judges/models/judge.model';

export interface SessionProposition {
    start: Date,
    end: Date,
    judge: Judge,
    room: Room,
    judgeId: String,
    roomId: String,
}