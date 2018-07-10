import { ProblemsPageComponent } from './problems-page.component';
import * as fromProblemsPartsActions from '../../actions/problem.action';

let problemsPageComponent: ProblemsPageComponent;
let storeSpy;

describe('ProblemsPageComponent', () => {
    beforeAll(() => {
        storeSpy = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);
        problemsPageComponent = new ProblemsPageComponent(storeSpy)
        problemsPageComponent.ngOnInit()
    });

    it('should create component', () => {
        expect(problemsPageComponent).toBeDefined();
    });

    it('should call store', () => {
        expect(storeSpy.pipe).toHaveBeenCalled();
    });

    it('should dispatch action on store', () => {
        expect(storeSpy.dispatch).toHaveBeenCalledWith(new fromProblemsPartsActions.Get());
    })
});
