import { getProblems } from './index';
import { Dictionary } from '@ngrx/entity/src/models';
import { Problem } from '../models/problem.model';

const problemDict = {
    '1': {
        id: '1',
        message: undefined,
        severity: undefined,
        type: undefined,
        references: undefined,
        createdAt: '2008-09-15T15:53:00+05:00'
    }
}

describe('Problem selectors', () => {
    describe('getProblems', () => {
        it('should return problems with createdAt property as moment', () => {
            const problemsDict: Dictionary<Problem> = getProblems.projector(problemDict)
            const problem: Problem = Object.values(problemsDict)[0]
            expect(problem.createdAt.isValid()).toBeTruthy()
        })
    });
})
