import { Judge } from '../../judges/models/judge.model';
import { Room } from '../../rooms/models/room.model';
import { HearingPart } from '../../hearing-part/models/hearing-part';

export interface SessionViewModel {
    id: number;
    start: Date;
    duration: number;
    room: Room;
    person: Judge;
    caseType: string;
    hearingParts: [HearingPart]
    jurisdiction: string;
}
