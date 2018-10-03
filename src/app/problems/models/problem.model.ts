import { ProblemReference } from './problem-reference.model';
import * as moment from 'moment';

export interface ProblemResponse {
    id: string;
    message: string;
    severity: string;
    type: string;
    references: ProblemReference[];
    createdAt: string
}
export interface Problem {
    id: string;
    message: string;
    severity: string;
    type: string;
    references: ProblemReference[];
    createdAt: moment.Moment
}
