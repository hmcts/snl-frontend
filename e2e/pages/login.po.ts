import { element, by, browser, promise } from 'protractor';
import { ElementHelper } from '../utils/element-helper';

export class LoginPage {
    username = element(by.id('username'))
    password = element(by.id('password'))
    loginButton = element(by.id('login'))
    elementHelper = new ElementHelper()

    login(username: string, password: string) {
        this.elementHelper.typeValue(this.username, username)
        this.elementHelper.typeValue(this.password, password)
        this.loginButton.click()
        browser.waitForAngular()
    }

    isDisplayed(): promise.Promise<boolean> {
        return this.username.isDisplayed()
    }
}
