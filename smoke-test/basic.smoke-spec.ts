import { browser } from 'protractor';
import { LoginPage } from '../e2e/pages/login.po';

const loginPage = new LoginPage();

describe('SNL frontend smoke tests', () => {
    describe('health check', () => {
        it('should get page', () => {
            browser.get('/');

            loginPage.isDisplayed();
            expect(browser.getTitle()).toEqual('Scheduling and Listing');
        });
    });
});
