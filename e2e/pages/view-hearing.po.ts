import { browser, by, element, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';

export class ViewHearingPage {
    private header = element(by.css('h2'));

    async waitUntilVisible() {
        await browser.wait(
            ExpectedConditions.visibilityOf(this.header),
            Wait.normal,
            'View Hearing page is not visible'
        );

        return this;
    }

    async getHeaderText() {
        return this.header.getText();
    }
}