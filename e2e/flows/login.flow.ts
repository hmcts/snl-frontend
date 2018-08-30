import { TopMenu } from './../pages/top-menu.po';
import { LoginPage } from '../pages/login.po';
import { Credentials } from '../enums/credentials';
import { ExpectedConditions, browser } from 'protractor';

export class LoginFlow {
  loginPage = new LoginPage();
  topMenu = new TopMenu();

  login() {
    this.loginPage.login(
      Credentials.ValidOfficerUsername,
      Credentials.ValidOfficerPassword
    );
  }

  async loginIfNeeded() {
    const isLoginPageDisplayed = await this.loginPage.isPresent();
    if (isLoginPageDisplayed) {
      this.login();
    }
  }

  async logoutIfNeeded() {
    const isLoginPageDisplayed = await this.loginPage.isPresent();
    if (!isLoginPageDisplayed) {
      this.topMenu.clickOnLogoutButton()
      browser.wait(ExpectedConditions.visibilityOf(this.loginPage.loginButton), 5000)
    }
  }
}
