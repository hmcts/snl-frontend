import { Observable } from 'rxjs/Observable';
import { Problem } from '../../problems/models/problem.model';
import { ProblemViewmodel } from '../../problems/models/problem.viewmodel';

export interface SessionCreationSummary {
    sessionLoading: Observable<boolean>,
    problemsLoading$: Observable<boolean>,
    problems$: Observable<ProblemViewmodel[]>
}
