import * as moment from 'moment'

export interface HearingPart {
    id: string;
    sessionId: string;
    caseNumber: string;
    caseType: string;
    hearingType: string
    duration: moment.Duration
    scheduleStart: Date;
    scheduleEnd: Date;
}
