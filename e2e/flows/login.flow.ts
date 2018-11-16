import { TopMenu } from '../pages/top-menu.po';
import { LoginPage } from '../pages/login.po';
import { Credentials } from '../enums/credentials';
import { ExpectedConditions, browser } from 'protractor';
import { Wait } from '../enums/wait';
import { Logger } from '../utils/logger';

export class LoginFlow {
    loginPage = new LoginPage();
    topMenu = new TopMenu();

    private async goHome() {
        if (!this.loginPage.isPresent()) {
            await browser.get('/');
            await browser.wait(ExpectedConditions.urlContains('/home/calendar'), Wait.short)
                .catch(() => Promise.resolve(false));
            Logger.log('Done waiting for homepage')
        }
    }

    async login() {
        await this.loginPage.login(
            Credentials.ValidOfficerUsername,
            Credentials.ValidOfficerPassword
        );
    }

    async loginIfNeeded(): Promise<void> {
        await this.goHome()
        const isLoginPageDisplayed = await this.loginPage.isPresent();
        if (isLoginPageDisplayed) {
            await this.login();
        }
    }

    async logoutIfNeeded() {
        await this.goHome()
        const isLoginPageDisplayed = await this.loginPage.isPresent();
        if (!isLoginPageDisplayed) {
            await this.topMenu.clickOnLogoutButton()
            await browser.wait(ExpectedConditions.urlContains('login'), Wait.normal, `Login URL didn't appear`)
            await this.loginPage.waitUntilLoaded()
        }
    }
}
