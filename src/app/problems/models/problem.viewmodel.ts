import { ProblemReference } from './problem-reference.model';

export interface ProblemViewmodel {
    id: string;
    message: string;
    severity: string;
    type: string;
    references: [ProblemReference];
}
