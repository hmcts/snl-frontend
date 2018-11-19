import { Priority } from './priority-model';
import * as moment from 'moment';
import { Note } from '../../notes/models/note.model';

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
    status: string,
    multiSession: boolean,
    numberOfSessions: number
}

export interface HearingSearchResponseForAmendment {
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
    personName: string,
    status: string,
    multiSession: boolean,
    numberOfSessions: number
}

export interface HearingViewmodelForAmendment {
    hearing: HearingSearchResponseForAmendment;
    notes: Note[]
}
