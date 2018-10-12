import { ProblemsPageComponent } from './problems-page.component';
import { TestBed } from '@angular/core/testing';
import { Problem, Page } from '../../models/problem.model';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { ProblemsService } from '../../services/problems.service';
import { Observable } from 'rxjs';

const pagedFakeProblems: Page<Problem> = {
    content: [{
        id: uuid(),
        message: undefined,
        severity: 'Warning',
        type: undefined,
        references: undefined,
        createdAt: moment()
    }],
    last: true,
    totalElements: 1,
    totalPages: 1,
    size: 1,
    number: 1,
    first: true,
    sort: null,
    numberOfElements: 1
}
let problemsPageComponent: ProblemsPageComponent;
let problemServiceSpy: jasmine.SpyObj<ProblemsService> = jasmine.createSpyObj('ProblemsService', ['getPaginated']);
problemServiceSpy.getPaginated.and.returnValue(Observable.of(pagedFakeProblems))

describe('ProblemsPageComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProblemsPageComponent,
                { provide: ProblemsService, useValue: problemServiceSpy },
            ]
        });

        problemsPageComponent = TestBed.get(ProblemsPageComponent);
    });

    it('should create component', () => {
        expect(problemsPageComponent).toBeDefined();
    });

    it('should set problems property', () => {
        const pageEvent = {
            pageIndex: 0,
            pageSize: 20,
            length: undefined
        }
        problemsPageComponent.fetchProblems(pageEvent)
        expect(problemsPageComponent.problems).toEqual(pagedFakeProblems.content)
    });
});
