import { LoginFlow } from '../e2e/flows/login.flow';
import { browser } from 'protractor';
import { LoginPage } from '../e2e/pages/login.po';
import { API } from '../e2e/utils/api';

const loginPage = new LoginPage();
const loginFlow = new LoginFlow();

describe('SNL frontend smoke tests', () => {
    describe('health check', () => {
        it('should get login page', async () => {
            await browser.get('/');
            await loginFlow.logoutIfNeeded();
            expect(await loginPage.isPresent()).toBeTruthy();
            expect(await browser.getTitle()).toEqual('Scheduling and Listing');
        });
        it('api health check should return status UP', async () => {
            const response = await API.healthCheck();
            expect(response).toBe(`{"status":"UP"}`);
        });
    });
});
