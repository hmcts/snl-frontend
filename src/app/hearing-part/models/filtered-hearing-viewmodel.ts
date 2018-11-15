import { Priority } from './priority-model';
import * as moment from 'moment';

export interface FilteredHearingViewmodel {
    id: string,
    caseNumber: string,
    caseTitle: string,
    caseTypeCode: string,
    caseTypeDescription: string,
    hearingTypeCode: string,
    hearingTypeDescription: string,
    duration: moment.Duration,
    scheduleStart: moment.Moment,
    scheduleEnd: moment.Moment,
    reservedJudgeId: string,
    reservedJudgeName: string,
    communicationFacilitator: string,
    priority: Priority,
    version: number,
    listingDate: moment.Moment,
    status: string
}
