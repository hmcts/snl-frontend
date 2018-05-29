import { Observable } from 'rxjs/Observable';
import { Problem } from '../../problems/models/problem.model';

export interface SessionCreationSummary {
    sessionLoading: Observable<boolean>,
    problemsLoading$: Observable<boolean>,
    problems$: Observable<Problem[]>
}
