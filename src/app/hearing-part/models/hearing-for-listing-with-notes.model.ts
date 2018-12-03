import { Judge } from '../../judges/models/judge.model';
import { Note } from '../../notes/models/note.model';
import { HearingType } from '../../core/reference/models/hearing-type';
import { fromNumber, Priority } from './priority-model';
import { CaseType } from '../../core/reference/models/case-type';
import * as moment from 'moment';
import { fromString, Status } from '../../core/reference/models/status.model';

export interface HearingForListingWithNotes {
    id: string;
    caseNumber: string;
    caseTitle: string;
    caseType: CaseType;
    hearingType: HearingType;
    duration: moment.Duration;
    scheduleStart: moment.Moment;
    scheduleEnd: moment.Moment;
    notes: Note[];
    version: number;
    priority: Priority;
    communicationFacilitator: string;
    reservedJudge: Judge;
    reservedJudgeId: string;
    isListed: boolean;
    numberOfSessions: number;
    multiSession: boolean;
}

export const DEFAULT_HEARING_FOR_LISTING_WITH_NOTES: HearingForListingWithNotes = {
    id: null,
    caseNumber: null,
    caseTitle: null,
    caseType: {code: '', description: ''} as CaseType,
    hearingType: {code: '', description: ''} as HearingType,
    duration: null,
    scheduleStart: null,
    scheduleEnd: null,
    version: null,
    priority: null,
    reservedJudgeId: null,
    reservedJudge: null,
    communicationFacilitator: null,
    notes: [],
    isListed: false,
    numberOfSessions: 1,
    multiSession: false
};

export interface HearingForListing {
    id: string;
    caseNumber: string;
    caseTitle: string;
    caseType: CaseType;
    hearingType: HearingType;
    duration: moment.Duration;
    scheduleStart: moment.Moment;
    scheduleEnd: moment.Moment;
    version: number;
    priority: Priority;
    communicationFacilitator: string;
    reservedJudge: Judge;
    reservedJudgeId: string;
    isListed: boolean;
    numberOfSessions: number;
    multiSession: boolean;
}

export interface HearingForListingResponse {
    id: string;
    caseNumber: string;
    caseTitle: string;
    caseTypeCode: string;
    caseTypeDescription: string;
    hearingTypeCode: string;
    hearingTypeDescription: string;
    duration: string;
    scheduleStart: string;
    scheduleEnd: string;
    version: number;
    priority: number;
    communicationFacilitator: string;
    reservedJudgeName: string;
    reservedJudgeId: string;
    status: string;
    numberOfSessions: number;
    isMultisession: boolean;
}

export const DEFAULT_HEARING_FOR_LISTING_RESPONSE: HearingForListingResponse = {
    id: undefined,
    caseNumber: undefined,
    caseTitle: undefined,
    caseTypeCode: undefined,
    caseTypeDescription: undefined,
    hearingTypeCode: undefined,
    hearingTypeDescription: undefined,
    duration: undefined,
    scheduleStart: undefined,
    scheduleEnd: undefined,
    version: undefined,
    priority: 1,
    communicationFacilitator: undefined,
    reservedJudgeName: undefined,
    reservedJudgeId: undefined,
    status: 'Listed',
    numberOfSessions: undefined,
    isMultisession: undefined
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
