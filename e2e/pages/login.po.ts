import { element, by, browser, promise } from 'protractor';
import { ElementHelper } from '../utils/element-helper';

export class LoginPage {
  loginButton = element(by.id('login'));
  private username = element(by.id('username'));
  private password = element(by.id('password'));
  private elementHelper = new ElementHelper();

  login(username: string, password: string) {
    this.elementHelper.typeValue(this.username, username);
    this.elementHelper.typeValue(this.password, password);
    this.loginButton.click();
    browser.waitForAngular();
  }

  isPresent(): promise.Promise<boolean> {
    return this.username.isPresent();
  }
}
