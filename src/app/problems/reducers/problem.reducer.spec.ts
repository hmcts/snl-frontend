import { reducer } from './problem.reducer';
import { Get, GetComplete, GetFailed, RemoveAll, UpsertMany } from '../actions/problem.action';
import { Problem } from '../models/problem.model';

describe('ProblemReducer', () => {

    it('should set loading to true', () => {
        let state = reducer(undefined, new Get());

        expect(state.loading).toEqual(true)
    });

    it('should set loading to false and populate entities', () => {
        let state = reducer(undefined, new GetComplete(problems));

        expect(state.loading).toEqual(false)
        expect(state.entities).toEqual(problemsEntities)

    });

    it('should set loading to false and give error', () => {
        const errorMessage = 'there was an error';
        let state = reducer(undefined, new GetFailed(errorMessage));

        expect(state.loading).toEqual(false)
        expect(state.error).toEqual(errorMessage)
    });

    it('should upsert problems to state', () => {
        let state = reducer(undefined, new GetComplete(problems));
        state = reducer(state, new UpsertMany(problemsUpsert));

        expect(state.entities).toEqual(problemsEntitiesUpserted)
    });

    it('should add problems and then remove them from state', () => {
        let state = reducer(undefined, new GetComplete(problems));

        expect(state.entities).toEqual(problemsEntities);

        state = reducer(state, new RemoveAll());
        expect(state.entities).toEqual({})
    });

});

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

const problemsEntities = {
    '1': problems[0],
    '2': problems[1]
};

const problemsUpsert = [
    {
        id: '1',
        message: 'some msg',
        severity: undefined,
        type: undefined,
        references: undefined
    },
    {
        id: '2',
        message: undefined,
        severity: undefined,
        type: 'abcde',
        references: undefined
    }
];

const problemsEntitiesUpserted = {
    '1': problemsUpsert[0],
    '2': problemsUpsert[1]
};
