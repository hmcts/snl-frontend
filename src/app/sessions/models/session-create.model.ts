import * as moment from 'moment';
import { CaseType } from 'app/core/reference/models/case-type';

export interface SessionCreate {
    id: string;
    userTransactionId: string,
    personId: string;
    roomId: string;
    duration: number;
    start: moment.Moment;
    caseType: CaseType
}
