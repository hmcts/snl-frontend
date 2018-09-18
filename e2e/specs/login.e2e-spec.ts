import { LoginFlow } from './../flows/login.flow';
import { browser, ExpectedConditions } from 'protractor';
import { LoginPage } from '../pages/login.po';
import { Credentials } from '../enums/credentials';
import { Wait } from '../enums/wait';

const loginPage = new LoginPage()
const loginFlow = new LoginFlow()

fdescribe('Login', () => {
  describe('When login using invalid credentials', () => {
    it('should not change URL', async () => {
      await loginFlow.logoutIfNeeded()
      const expectedURL = await browser.wait(browser.getCurrentUrl(), Wait.normal)
      await loginPage.login('invalidUserName', 'invalidPassword')
      expect(await browser.getCurrentUrl()).toEqual(expectedURL)
    });
  });
  describe('When login using valid credentials', () => {
    it('should change URL to calendar', async () => {
      await loginPage.login(Credentials.ValidOfficerUsername, Credentials.ValidOfficerPassword);
      await browser.wait(ExpectedConditions.urlContains('/home/calendar'), Wait.normal);
      expect(await browser.getCurrentUrl()).toContain('/home/calendar');
    });
  });
});
