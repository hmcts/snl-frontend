import { Status } from './../../core/reference/models/status.model';
import { UpdateHearingRequest } from './update-hearing-request';
import * as moment from 'moment'
import { Note } from '../../notes/models/note.model';
import { Priority } from './priority-model';
import { Judge } from '../../judges/models/judge.model';
import { HearingType } from '../../core/reference/models/hearing-type';
import { CaseType } from '../../core/reference/models/case-type';
import { HearingForListingWithNotes } from './hearing-for-listing-with-notes.model';

export interface HearingPartViewModel {
    id: string;
    sessionId: string;
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
    hearingId: string;
    start: moment.Moment;
    multiSession: boolean;
    status: Status
}

export function mapToUpdateHearingRequest(hvm: HearingForListingWithNotes): UpdateHearingRequest {
    return {
        id: hvm.id,
        caseNumber: hvm.caseNumber,
        caseTitle: hvm.caseTitle,
        caseTypeCode: hvm.caseType.code,
        hearingTypeCode: hvm.hearingType.code,
        duration: hvm.duration,
        scheduleStart: hvm.scheduleStart,
        scheduleEnd: hvm.scheduleEnd,
        version: hvm.version,
        priority: hvm.priority,
        reservedJudgeId: hvm.reservedJudgeId,
        communicationFacilitator: hvm.communicationFacilitator,
        userTransactionId: undefined,
        numberOfSessions: hvm.numberOfSessions,
        multiSession: hvm.multiSession
    }
}
