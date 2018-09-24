import { ProblemsPageComponent } from './problems-page.component';
import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { Problem } from '../../models/problem.model';
import { reducers } from '../../reducers';
import * as problemsActions from '../../actions/problem.action';
import * as fromProblems from '../../reducers';
import * as moment from 'moment';

let problemsPageComponent: ProblemsPageComponent;
let storeSpy: jasmine.Spy;
let store: Store<fromProblems.State>;

const theNewestProblem: Problem = {
    id: '1',
    message: undefined,
    severity: undefined,
    type: undefined,
    references: undefined,
    createdAt: moment()
}

const theOldestProblem: Problem = {
    id: '3',
    message: undefined,
    severity: undefined,
    type: undefined,
    references: undefined,
    createdAt: moment().subtract(2, 'hours')
}

const middleProblem: Problem = {
    id: '2',
    message: undefined,
    severity: undefined,
    type: undefined,
    references: undefined,
    createdAt: moment().subtract(1, 'hours')
}

const problemWithUndefinedCreatedAt: Problem = {
    id: '4',
    message: undefined,
    severity: undefined,
    type: undefined,
    references: undefined,
    createdAt: moment(null)
}

const problems: Problem[] = [
    problemWithUndefinedCreatedAt,
    theNewestProblem,
    theOldestProblem,
    middleProblem
];

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

    it('should populate problems', () => {
        store.dispatch(new problemsActions.GetComplete(problems));

        problemsPageComponent.problems$.subscribe(data => {
            expect(data.length).toEqual(problems.length);
            problems.forEach(problem => expect(data).toContain(problem))
        })
    });

    describe('sortByCreatedAtDescending', () => {
        it('should sort by created at property - the newest problems should be first', () => {
            const sortedProblems = problemsPageComponent.sortByCreatedAtDescending(problems)
            expect(sortedProblems).toEqual([
                theNewestProblem,
                middleProblem,
                theOldestProblem,
                problemWithUndefinedCreatedAt
            ])
        });
    });
});
