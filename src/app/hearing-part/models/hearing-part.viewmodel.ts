import { UpdateHearingPartRequest } from './update-hearing-part-request';
import * as moment from 'moment'
import { Note } from '../../notes/models/note.model';
import { Priority } from './priority-model';
import { Judge } from '../../judges/models/judge.model';
import { HearingType } from '../../core/reference/models/hearing-type';
import { CaseType } from '../../core/reference/models/case-type';

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
}

export function mapToUpdateHearingPartRequest(hpvm: HearingPartViewModel): UpdateHearingPartRequest {
    return {
        id: hpvm.id,
        caseNumber: hpvm.caseNumber,
        caseTitle: hpvm.caseTitle,
        caseTypeCode: hpvm.caseType.code,
        hearingTypeCode: hpvm.hearingType.code,
        duration: hpvm.duration,
        scheduleStart: hpvm.scheduleStart,
        scheduleEnd: hpvm.scheduleEnd,
        version: hpvm.version,
        priority: hpvm.priority,
        reservedJudgeId: hpvm.reservedJudgeId,
        communicationFacilitator: hpvm.communicationFacilitator,
        userTransactionId: undefined
    }
}
