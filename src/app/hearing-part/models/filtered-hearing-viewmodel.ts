import { Priority } from './priority-model';
import * as moment from 'moment';
import { Note } from '../../notes/models/note.model';
import { UpdateHearingRequest } from './update-hearing-request';
import { Status } from '../../core/reference/models/status.model';

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

export function mapToUpdateHearingRequest(h: HearingViewmodelForAmendment, transactionId: string): UpdateHearingRequest {
    let update: UpdateHearingRequest = {
        id: h.hearing.id,
        caseNumber: h.hearing.caseNumber,
        caseTitle: h.hearing.caseTitle,
        caseTypeCode: h.hearing.caseTypeCode,
        hearingTypeCode: h.hearing.hearingTypeCode,
        duration: h.hearing.duration,
        scheduleStart: h.hearing.scheduleStart,
        scheduleEnd: h.hearing.scheduleEnd,
        priority: h.hearing.priority,
        reservedJudgeId: h.hearing.reservedJudgeId,
        communicationFacilitator: h.hearing.communicationFacilitator,
        userTransactionId: transactionId,
        numberOfSessions: h.hearing.numberOfSessions,
        multiSession: h.hearing.multiSession,
        version: h.hearing.version,
        isListed: h.hearing.status === Status.Listed,
    }

    return update;
}
