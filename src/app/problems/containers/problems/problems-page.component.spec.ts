import { ProblemsPageComponent } from './problems-page.component';
import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { Problem } from '../../models/problem.model';
import { reducers } from '../../reducers';
import * as problemsActions from '../../actions/problem.action';
import * as fromProblems from '../../reducers';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';

let problemsPageComponent: ProblemsPageComponent;
let storeSpy: jasmine.Spy;
let store: Store<fromProblems.State>;

describe('ProblemsPageComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({}),
                StoreModule.forFeature('problems', reducers),
            ],
            providers: [ProblemsPageComponent]
        });

        store = TestBed.get(Store)
        storeSpy = spyOn(store, 'dispatch').and.callThrough();

        problemsPageComponent = TestBed.get(ProblemsPageComponent);
        problemsPageComponent.ngOnInit();
    });

    it('should create component', () => {
        expect(problemsPageComponent).toBeDefined();
    });

    it('should dispatch get action on store', () => {
        const passedObj = storeSpy.calls.argsFor(0)[0];
        expect(passedObj instanceof problemsActions.Get).toBeTruthy();
    });

    it('should set sorted problems by priority and date', () => {
        const theNewestWarningProblem = problemGenerator(moment(), 'Warning')
        const olderUrgentProblem = problemGenerator(moment().subtract(1, 'hours'), 'Urgent')
        const evenOlderCriticalProblem = problemGenerator(moment().subtract(2, 'hours'), 'Critical')
        const nowUndefinedSeverityProblem = problemGenerator(moment(null), 'Some Severity')
        const undefinedCreatedAtCriticalProblem = problemGenerator(moment(null), 'Critical')

        const problems: Problem[] = [
            theNewestWarningProblem,
            olderUrgentProblem,
            evenOlderCriticalProblem,
            nowUndefinedSeverityProblem,
            undefinedCreatedAtCriticalProblem
        ];
        store.dispatch(new problemsActions.GetComplete(problems));

        problemsPageComponent = TestBed.get(ProblemsPageComponent);
        problemsPageComponent.ngOnInit();

        const expectedProblemOrder: Problem[] = [
            evenOlderCriticalProblem,
            undefinedCreatedAtCriticalProblem,
            olderUrgentProblem,
            theNewestWarningProblem,
            nowUndefinedSeverityProblem
        ]

        expect(problemsPageComponent.problems).toEqual(expectedProblemOrder)
    });
});

function problemGenerator(createdAt: moment.Moment, severity = 'Warning'): Problem {
    return {
        id: uuid(),
        message: undefined,
        severity: severity,
        type: undefined,
        references: undefined,
        createdAt: createdAt
    }
}
