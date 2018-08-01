import { browser } from 'protractor';
import { LoginPage } from '../pages/login.po';
import { Credentials } from '../enums/credentials';

let loginPage: LoginPage

describe('Login', () => {
  beforeEach(() => {
    loginPage = new LoginPage();
  });
  describe('When login using invalid credentials', () => {
    it('should not change URL', () => {
      const expectedURL = browser.getCurrentUrl()
      loginPage.login('invalidUserName', 'invalidPassword')
      expect(browser.getCurrentUrl()).toEqual(expectedURL)
    });
  });
  describe('When login using valid credentials', () => {
    it('should change URL to calendar', () => {
      loginPage.login(Credentials.ValidOfficerUsername, Credentials.ValidOfficerPassword);
        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toContain('/home/calendar');
    });
  });
});
