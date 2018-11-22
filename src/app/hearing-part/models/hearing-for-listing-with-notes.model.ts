import { Judge } from '../../judges/models/judge.model';
import { Note } from '../../notes/models/note.model';
import { HearingType } from '../../core/reference/models/hearing-type';
import { fromNumber, Priority } from './priority-model';
import { CaseType } from '../../core/reference/models/case-type';
import * as moment from 'moment';
import { fromString, Status } from '../../core/reference/models/status.model';

export interface HearingForListingWithNotes {
    id: string; //
    caseNumber: string; //
    caseTitle: string; //
    caseType: CaseType; // dojoinowac case type
    hearingType: HearingType; // dojoinowac hearing type
    duration: moment.Duration; //
    scheduleStart: moment.Moment; //
    scheduleEnd: moment.Moment; //
    notes: Note[]; // dociągnąć
    version: number; //
    priority: Priority; //
    communicationFacilitator: string;
    reservedJudge: Judge;
    reservedJudgeId: string;
    isListed: boolean;
    numberOfSessions: number;
    multiSession: boolean;
}

export interface HearingForListing {
    id: string; //
    caseNumber: string; //
    caseTitle: string; //
    caseType: CaseType; // dojoinowac case type
    hearingType: HearingType; // dojoinowac hearing type
    duration: moment.Duration; //
    scheduleStart: moment.Moment; //
    scheduleEnd: moment.Moment; //
    version: number; //
    priority: Priority; //
    communicationFacilitator: string;
    reservedJudge: Judge;
    reservedJudgeId: string;
    isListed: boolean;
    numberOfSessions: number;
    multiSession: boolean;
}

export interface HearingForListingResponse {
    id: string; //
    caseNumber: string; //
    caseTitle: string; //
    caseTypeCode: string; // dojoinowac case type
    caseTypeDescription: string; // dojoinowac case type
    hearingTypeCode: string; // dojoinowac hearing type
    hearingTypeDescription: string; // dojoinowac hearing type
    duration: string; //
    scheduleStart: string; //
    scheduleEnd: string; //
    version: number; //
    priority: number; //
    communicationFacilitator: string;
    reservedJudgeName: string;
    reservedJudgeId: string;
    status: string;
    numberOfSessions: number;
    isMultisession: boolean;
}

export function mapResponseToHearingForListing(hvr: HearingForListingResponse): HearingForListing {
    let caseType: CaseType = { code: hvr.caseTypeCode, description: hvr.caseTypeDescription, hearingTypes: []};
    let hearingType: HearingType = { code: hvr.hearingTypeCode, description: hvr.hearingTypeDescription};
    let reservedJudge: Judge = { id: hvr.reservedJudgeId, name: hvr.reservedJudgeName};
    const hearingForListing: HearingForListing = {
        id: hvr.id,
        caseNumber: hvr.caseNumber,
        caseTitle: hvr.caseTitle,
        caseType: caseType,
        hearingType: hearingType,
        duration: moment.duration(hvr.duration),
        scheduleStart: moment(hvr.scheduleStart),
        scheduleEnd: moment(hvr.scheduleEnd),
        version: hvr.version,
        priority: fromNumber(hvr.priority),
        communicationFacilitator: hvr.communicationFacilitator,
        reservedJudge: reservedJudge,
        reservedJudgeId: hvr.reservedJudgeId,
        isListed: fromString(hvr.status) === Status.Listed,
        numberOfSessions: hvr.numberOfSessions,
        multiSession: hvr.isMultisession
    }

    return hearingForListing;
}
