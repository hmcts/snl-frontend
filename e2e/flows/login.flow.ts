import { LoginPage } from '../pages/login.po';
import { Credentials } from '../enums/credentials';

export class LoginFlow {
  loginPage = new LoginPage();

  login() {
    this.loginPage.login(
      Credentials.ValidOfficerUsername,
      Credentials.ValidOfficerPassword
    );
  }

  async loginIfNeeded() {
    const isLoginPageDisplayed = await this.loginPage.isDisplayed();
    if (isLoginPageDisplayed) {
      this.login();
    }
  }
}
