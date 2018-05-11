import { Judge } from '../../judges/models/judge.model';
import { Room } from '../../rooms/models/room.model';

export interface SessionViewModel {
    id: number;
    start: Date;
    duration: number;
    room: Room;
    person: Judge;
    caseType: string;
    jurisdiction: string;
}
