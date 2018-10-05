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

export interface Page<T> {
    content: T[],
    last: boolean,
    totalElements: number,
    totalPages: number,
    size: number,
    number: number,
    first: boolean,
    sort: any,
    numberOfElements: number
}
