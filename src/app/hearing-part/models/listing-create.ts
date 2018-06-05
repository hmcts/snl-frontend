import * as moment from 'moment'

export interface ListingCreate {
    id: string;
    caseNumber: string;
    caseTitle: string;
    caseType: string;
    hearingType: string
    duration: moment.Duration
    scheduleStart: Date;
    scheduleEnd: Date;
    createdAt: Date;
}
