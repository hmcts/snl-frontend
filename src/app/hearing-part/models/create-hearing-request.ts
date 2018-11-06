import * as moment from 'moment'
import { Priority } from './priority-model';

export interface CreateHearingRequest {
    id: string;
    caseNumber: string;
    caseTitle: string;
    caseTypeCode: string;
    hearingTypeCode: string;
    duration: moment.Duration
    scheduleStart: moment.Moment;
    scheduleEnd: moment.Moment;
    priority: Priority;
    reservedJudgeId: string;
    communicationFacilitator: string;
    userTransactionId: string;
    numberOfSessions: number;
    isMultiSession: boolean;
}
