import * as moment from 'moment'

export interface HearingPart {
    id: string;
    session: string;
    caseNumber: string;
    caseTitle: string;
    caseType: string;
    hearingType: string
    duration: moment.Duration
    scheduleStart: Date;
    scheduleEnd: Date;
    version: number;
}
