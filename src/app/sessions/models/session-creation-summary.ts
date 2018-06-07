import { Observable } from 'rxjs/Observable';
import { Problem } from '../../problems/models/problem.model';
import { SessionTransaction } from './session-transaction-status.model';

export interface SessionCreationSummary {
    createdSessionStatus$: Observable<SessionTransaction>,
    problems$: Observable<Problem[]>
}
