import { Observable } from 'rxjs/Observable';
import { Problem } from '../../problems/models/problem.model';
import { SessionCreationStatus } from './session-creation-status.model';

export interface SessionCreationSummary {
    createdSessionStatus$: Observable<SessionCreationStatus>,
    problems$: Observable<Problem[]>
}
