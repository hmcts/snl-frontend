import { element, by, browser, ExpectedConditions } from 'protractor';
import { ElementHelper } from '../utils/element-helper';

export class LoginPage {
  loginButton = element(by.id('login'));
  private username = element(by.id('username'));
  private password = element(by.id('password'));
  private elementHelper = new ElementHelper();

  async login(username: string, password: string) {
    await this.elementHelper.typeValue(this.username, username);
    await this.elementHelper.typeValue(this.password, password);
    await this.loginButton.click();
    await browser.waitForAngular();
  }

  async isPresent(): Promise<boolean> {
    return await this.username.isPresent();
  }

  async waitUntilLoaded() {
    return await browser.wait(ExpectedConditions.elementToBeClickable(this.username))
  }
}
