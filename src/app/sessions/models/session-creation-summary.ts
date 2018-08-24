import { Observable } from 'rxjs/Observable';
import { Problem } from '../../problems/models/problem.model';
import { EntityTransaction } from '../../features/transactions/models/transaction-status.model';

export interface SessionCreationSummary {
    createdSessionStatus$: Observable<EntityTransaction>,
    problems$: Observable<Problem[]>
}
