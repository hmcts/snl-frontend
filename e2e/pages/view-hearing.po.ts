import { browser, by, element, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';

export class ViewHearingPage {
    private header = element(by.id('case-number'));

    async waitUntilVisible() {
        await browser.wait(
            ExpectedConditions.visibilityOf(this.header),
            Wait.normal,
            'View Hearing page is not visible'
        );

        return this;
    }

    getHeaderText() {
        return this.header.getText();
    }
}
