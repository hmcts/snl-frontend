import { LoginFlow } from '../e2e/flows/login.flow';
import { browser } from 'protractor';
import { LoginPage } from '../e2e/pages/login.po';

const loginPage = new LoginPage();
const loginFlow = new LoginFlow();

describe('SNL frontend smoke tests', () => {
    describe('health check', () => {
        it('should get page', async () => {
            await browser.get('/');
            await loginFlow.logoutIfNeeded()
            expect(await loginPage.isPresent()).toBeTruthy();
            expect(await browser.getTitle()).toEqual('Scheduling and Listing');
        });
    });
});
