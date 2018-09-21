import { NavigationFlow } from '../flows/navigation.flow';
import * as moment from 'moment';
import { LoginFlow } from '../flows/login.flow';
import { SessionCreate } from '../../src/app/sessions/models/session-create.model';
import { API } from '../utils/api';
import { v4 as uuid } from 'uuid';
import { ProblemsPage } from '../pages/problems.po';
import { protractor } from 'protractor/built/ptor';
import { waitFor } from '../utils/wait-for';
import { forEachSeries } from 'p-iteration';

const navigationFlow = new NavigationFlow();
const loginFlow = new LoginFlow();
const problemsPage = new ProblemsPage()

const in5Minutes = moment().add(5, 'minute');

const sessionCreate: SessionCreate = {
    id: uuid(),
    userTransactionId: uuid(),
    personId: null,
    roomId: null,
    duration: 1800,
    start: in5Minutes,
    sessionTypeCode: 'fast-track---trial-only',
    caseType: undefined
};

let numberOfProblems: number;
let problemsBeforeAction;
let newProblems;
const numberOfExpectedProblems = 3 // because, Room & judge not set + is listed less than 50%

const displayValuesFromProblems = (problems: any[]): string[][] => {
    return problems.map((problem) => {
        const createdAt = moment(problem.createdAt).format('YYYY-MM-DD HH:mm')
        return [problem.severity, createdAt, problem.message]
    })
}

describe('Problem list tests', () => {
    describe('Go to Problems page', () => {
        beforeAll(async () => {
            await loginFlow.loginIfNeeded();
            await navigationFlow.goToProblemsPage();
        });

        it('Remember number of problems', async () => {
            problemsBeforeAction = (await API.getProblems()) as any[]
            numberOfProblems = await problemsPage.getNumberOfProblems()
            expect(numberOfProblems).toEqual(problemsBeforeAction.length)
        });

        it('create session via API for now, it should return 200 and create problems', async () => {
            const statusCode = await API.createSession(sessionCreate)
            expect(statusCode).toEqual(200)
        });

        it('wait until new problems will be generated', async () => {
            const result = await waitFor(5, async () => {
                const alreadyKnownIds = problemsBeforeAction.map(problem => problem.id)
                const problems = (await API.getProblems()) as any[]
                newProblems = problems.filter(x => !alreadyKnownIds.includes(x.id));
                return newProblems.length === numberOfExpectedProblems
            })

            expect(result).toBeTruthy('New problems has not been returned from API yet')
        });

        it('Refresh page, new problems should be visible in table', async () => {
            await protractor.browser.refresh();
            await navigationFlow.goToProblemsPage();
            const numberOfProblemsAfterSessionCreation = await problemsPage.getNumberOfProblems()

            await forEachSeries(displayValuesFromProblems(newProblems), async (problemValues) => {
                const areProblemsDisplayed = await problemsPage.isProblemDisplayed(problemValues)
                expect(areProblemsDisplayed).toBeTruthy()
            })

            expect(numberOfProblems + numberOfExpectedProblems).toEqual(numberOfProblemsAfterSessionCreation)
        });
    });
});
