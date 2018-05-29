import { ProblemReference } from './problem-reference.model';

export interface Problem {
    id: string;
    message: string;
    severity: string;
    type: string;
    references: [ProblemReference];
}
