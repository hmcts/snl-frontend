import { ProblemReference } from './problem-reference.model';
import * as moment from 'moment';

export interface Problem {
    id: string;
    message: string;
    severity: string;
    type: string;
    references: ProblemReference[];
    createdAt: moment.Moment
}

export enum Severity {
    Warning = 'Warning',
    Urgent = 'Urgent',
    Critical = 'Critical'
}

export function isGreater(lhs: Severity, rhs: Severity) {
    if (lhs === Severity.Critical && (rhs === Severity.Urgent || rhs === Severity.Warning)) {
        return 1;
    } else if (lhs === Severity.Urgent && (rhs === Severity.Warning)) {
        return 1;
    } else {
        return 0
    }
}
