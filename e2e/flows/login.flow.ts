import { TopMenu } from '../pages/top-menu.po';
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
        await browser.get('/');
        await browser.sleep(5000);
        const isLoginPageDisplayed = await this.loginPage.isPresent();
        if (isLoginPageDisplayed) {
            await this.login();
        }
    }

    async logoutIfNeeded() {
        await browser.get('/');
        await browser.sleep(5000);
        const isLoginPageDisplayed = await this.loginPage.isPresent();
        if (!isLoginPageDisplayed) {
            await this.topMenu.clickOnLogoutButton()
            await browser.wait(ExpectedConditions.urlContains('login'), Wait.normal, 'Login URL didn\'t appear')
            await this.loginPage.waitUntilLoaded()
        }
    }
}
