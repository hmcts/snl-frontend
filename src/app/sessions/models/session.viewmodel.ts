import { Judge } from '../../judges/models/judge.model';
import { Room } from '../../rooms/models/room.model';
import * as moment from 'moment';
import { CaseType } from '../../core/reference/models/case-type';
import { HearingPartViewModel } from '../../hearing-part/models/hearing-part.viewmodel';

export interface SessionViewModel {
    id: string;
    start: moment.Moment;
    duration: number;
    room: Room;
    person: Judge;
    caseType: CaseType;
    hearingParts: HearingPartViewModel[];
    jurisdiction: string;
    version: number;
    allocated: moment.Duration;
    utilization: number;
    available: moment.Duration;
}
