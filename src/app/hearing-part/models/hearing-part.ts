import * as moment from 'moment'
import { Priority } from './priority-model';

export interface HearingPart {
    id: string;
    session: string;
    caseNumber: string;
    caseTitle: string;
    caseType: string;
    hearingType: string; // | HearingType // TODO implements this
    duration: moment.Duration
    scheduleStart: Date;
    scheduleEnd: Date;
    version: number;
    priority: Priority;
    reservedJudgeId: string;
    communicationFacilitator: string;
}
