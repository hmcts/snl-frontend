import * as moment from 'moment'
import { Note } from '../../notes/models/note.model';
import { Priority } from './priority-model';
import { Judge } from '../../judges/models/judge.model';
import { HearingType } from '../../core/reference/models/hearing-type';
import { CaseType } from '../../core/reference/models/case-type';
import { HearingPart } from './hearing-part';

export interface HearingPartViewModel {
    id: string;
    session: string;
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

export function mapToHearingPart(hpvm: HearingPartViewModel) {
    return {
        id: hpvm.id,
        session: hpvm.session,
        caseNumber: hpvm.caseNumber,
        caseTitle: hpvm.caseTitle,
        caseType: hpvm.caseType.code,
        hearingType: hpvm.hearingType.code,
        duration: hpvm.duration,
        scheduleStart: hpvm.scheduleStart,
        scheduleEnd: hpvm.scheduleEnd,
        version: hpvm.version,
        priority: hpvm.priority,
        reservedJudgeId: hpvm.reservedJudgeId,
        communicationFacilitator: hpvm.communicationFacilitator
    } as HearingPart
}
