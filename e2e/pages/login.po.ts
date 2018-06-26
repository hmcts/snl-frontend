import { element, by } from 'protractor';

export class LoginPage {
    username = element(by.id('username'))
    password = element(by.id('password'))
    loginButton = element(by.id('login'))

    login(username: string, password: string) {
        this.username.clear()
        this.username.sendKeys(username)
        this.password.clear()
        this.password.sendKeys(password)
        this.loginButton.click()
    }
}
