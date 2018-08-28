import { reducer, initialState } from './judge.reducer';
import { GetComplete } from '../actions/judge.action';
import { getJudges, State } from './index';
import { Judge } from '../models/judge.model';

const judgeIdA = 'some-id-A';
const judgeA = generateJudge(judgeIdA);
const judgeIdB = 'some-id-B';
const judgeB = generateJudge(judgeIdB);
const judges: Judge[] = [
    judgeA,
    judgeB
];
let state: State;

describe('JudgeReducer', () => {
    describe('Get Complete', () => {
        beforeEach(() => {
            state = stateWith(reducer(initialState, new GetComplete(judges)));
        });

        it('should add judges to store', () => {
            expect(Object.keys(getJudges(state)).length).toEqual(2);
            expect(getJudges(state)[judgeIdA]).toEqual(judgeA);
            expect(getJudges(state)[judgeIdB]).toEqual(judgeB);
        });

        it('when get empty array should remove saved judges', () => {
            expect(Object.keys(getJudges(state)).length).toEqual(2);

            state = stateWith(reducer(state.judges.judges, new GetComplete([])));
            expect(Object.keys(getJudges(state)).length).toEqual(0);
        });
    });
});

function stateWith(judgeReducer): State {
    return { judges: { judges: judgeReducer }};
};

function generateJudge(id: string): Judge {
    return { id, name: 'some-judge-name' }
};
