import * as moment from 'moment'
import { Note } from '../../notes/models/note.model';
import { Priority } from './priority-model';

export interface HearingPartViewModel {
    id: string;
    session: string;
    caseNumber: string;
    caseTitle: string;
    caseType: string;
    hearingType: string;
    duration: moment.Duration;
    scheduleStart: Date;
    scheduleEnd: Date;
    notes: Note[];
    version: number;
    priority: Priority;
}
