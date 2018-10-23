import { Judge } from '../../judges/models/judge.model';
import { Note } from '../../notes/models/note.model';
import { HearingType } from '../../core/reference/models/hearing-type';
import { Priority } from './priority-model';
import { CaseType } from '../../core/reference/models/case-type';
import * as moment from 'moment';

export interface HearingViewmodel {
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
    numberOfSessionsNeeded: number;
}
