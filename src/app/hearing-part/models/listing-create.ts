import * as moment from 'moment'
import { Priority } from './priority-model';

export interface ListingCreate {
    id: string;
    caseNumber: string;
    caseTitle: string;
    caseType: string;
    hearingType: string
    duration: moment.Duration
    scheduleStart: moment.Moment;
    scheduleEnd: moment.Moment;
    createdAt: moment.Moment;
    priority: Priority;
}
