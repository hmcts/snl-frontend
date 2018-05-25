import { Observable } from 'rxjs/Observable';
import { Problem } from '../../problems/models/problem.model';

export interface SessionCreationSummary {
    sessionBeingCreated$: Observable<boolean>,
    problems$: Observable<Problem[]>,
    error$: Observable<string>
}
