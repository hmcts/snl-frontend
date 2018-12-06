import { browser, by, element, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';

export class ViewHearingPage {
    private header = element(by.id('case-number')).$('.case-number');
    private actionsDropDown = element(by.id('action'));

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

    async chooseAnActionFromDropDown(optionName: string) {
        await browser.wait(ExpectedConditions.elementToBeClickable(this.actionsDropDown),
            Wait.normal,
            `'Actions' dropdown is not clickable`);
        await this.actionsDropDown.click();
        const subElement = element(by.cssContainingText('.mat-option', optionName));
        await browser.wait(ExpectedConditions.visibilityOf((subElement)),
            Wait.normal,
            `'${optionName}' is not displayed in the 'Actions' dropdown`);
        await subElement.click();
    }
}
