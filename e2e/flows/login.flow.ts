import { TopMenu } from './../pages/top-menu.po';
import { LoginPage } from '../pages/login.po';
import { Credentials } from '../enums/credentials';
import { ExpectedConditions, browser } from 'protractor';
import { Wait } from '../enums/wait';

export class LoginFlow {
  loginPage = new LoginPage();
  topMenu = new TopMenu();

  async login() {
    await this.loginPage.login(
      Credentials.ValidOfficerUsername,
      Credentials.ValidOfficerPassword
    );
  }

  async loginIfNeeded(): Promise<void> {
    const isLoginPageDisplayed = await this.loginPage.isPresent();
    if (isLoginPageDisplayed) {
      await this.login();
    }
  }

  async logoutIfNeeded() {
    const isLoginPageDisplayed = await this.loginPage.isPresent();
    if (!isLoginPageDisplayed) {
      await this.topMenu.clickOnLogoutButton()
      await browser.wait(ExpectedConditions.urlContains('login'), Wait.normal, 'Login URL havent appear')
      await this.loginPage.waitUntilLoaded()
    }
  }

  async relogin() {
    await this.logoutIfNeeded();
    await this.loginIfNeeded();
  }
}
