import { ProblemsPageComponent } from './problems-page.component';
import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { Problem } from '../../models/problem.model';
import { reducers } from '../../reducers';
import * as problemsActions from '../../actions/problem.action';
import * as fromProblems from '../../reducers';

let problemsPageComponent: ProblemsPageComponent;
let storeSpy: jasmine.Spy;
let store: Store<fromProblems.State>;

const problems = [
    {
        id: '1',
        message: undefined,
        severity: undefined,
        type: undefined,
        references: undefined
    },
    {
        id: '2',
        message: undefined,
        severity: undefined,
        type: undefined,
        references: undefined
    }
] as Problem[];

describe('ProblemsPageComponent', () => {
    beforeAll(() => {
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
            expect(data).toEqual(problems);
        })
    });
});
