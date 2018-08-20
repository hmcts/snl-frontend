import { Judge } from '../../judges/models/judge.model';
import { Room } from '../../rooms/models/room.model';
import { HearingPart } from '../../hearing-part/models/hearing-part';
import * as moment from 'moment';

export interface SessionViewModel {
    id: string;
    start: moment.Moment;
    duration: number;
    room: Room;
    person: Judge;
    caseType: string;
    hearingParts: HearingPart[];
    jurisdiction: string;
    version: number;
    allocated: moment.Duration;
    utilization: number;
    available: moment.Duration;
}
