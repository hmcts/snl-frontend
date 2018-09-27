import { Judge } from '../../judges/models/judge.model';
import { Room } from '../../rooms/models/room.model';
import * as moment from 'moment';
import { HearingPartViewModel } from '../../hearing-part/models/hearing-part.viewmodel';
import { SessionType } from '../../core/reference/models/session-type';

export interface SessionViewModel {
    id: string;
    start: moment.Moment;
    duration: number;
    room: Room;
    person: Judge;
    sessionType: SessionType;
    hearingParts: HearingPartViewModel[];
    jurisdiction: string;
    version: number;
    allocated: moment.Duration;
    utilization: number;
    available: moment.Duration;
}
