import { ProblemsPageComponent } from './problems-page.component';
import { TestBed } from '@angular/core/testing';
import { Problem } from '../../models/problem.model';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { ProblemsService } from '../../services/problems.service';
import { Observable } from 'rxjs';

const fakeProblems: Problem[] = [
    {
        id: uuid(),
        message: undefined,
        severity: 'Warning',
        type: undefined,
        references: undefined,
        createdAt: moment()
    }
]
let problemsPageComponent: ProblemsPageComponent;
let problemServiceSpy: jasmine.SpyObj<ProblemsService> = jasmine.createSpyObj('ProblemsService', ['getAll']);
problemServiceSpy.getAll.and.returnValue(Observable.of(fakeProblems))

describe('ProblemsPageComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProblemsPageComponent,
                { provide: ProblemsService, useValue: problemServiceSpy },
            ]
        });

        problemsPageComponent = TestBed.get(ProblemsPageComponent);
        problemsPageComponent.ngOnInit();
    });

    it('should create component', () => {
        expect(problemsPageComponent).toBeDefined();
    });

    it('should call problem service to fetch problem', () => {
        expect(problemServiceSpy.getAll).toHaveBeenCalled()
    });

    it('should set problems property', () => {
        expect(problemsPageComponent.problems).toEqual(fakeProblems)
    });
});
