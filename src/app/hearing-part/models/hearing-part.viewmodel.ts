import * as moment from 'moment'
import { Note } from '../../notes/models/note.model';
import { Priority } from './priority-model';
import { Judge } from '../../judges/models/judge.model';
import { HearingType } from '../../core/reference/models/hearing-type';
import { CaseType } from '../../core/reference/models/case-type';

export interface HearingPartViewModel {
    id: string;
    session: string;
    caseNumber: string;
    caseTitle: string;
    caseType: CaseType;
    hearingType: HearingType;
    duration: moment.Duration;
    scheduleStart: Date;
    scheduleEnd: Date;
    notes: Note[];
    version: number;
    priority: Priority;
    communicationFacilitator: string;
    reservedJudge: Judge;
    reservedJudgeId: string;
}
