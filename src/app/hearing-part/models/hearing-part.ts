import * as moment from 'moment'
import { Priority } from './priority-model';

export interface HearingPart {
    id: string;
    session: string;
    caseNumber: string;
    caseTitle: string;
    caseType: string;
    hearingType: string
    duration: moment.Duration
    scheduleStart: moment.Moment;
    scheduleEnd: moment.Moment;
    version: number;
    priority: Priority;
    reservedJudgeId: string;
    communicationFacilitator: string;
}
