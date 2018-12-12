import { browser, by, element, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';
import { ElementHelper } from '../utils/element-helper';

export class ViewHearingPage {
    private header = element(by.id('case-number')).$('.case-number');
    private status = element(by.id('status'));
    private actionsDropDown = element(by.id('action'));
    private helper: ElementHelper = new ElementHelper();

    async waitUntilVisible() {
        await browser.wait(
            ExpectedConditions.visibilityOf(this.header),
            Wait.normal,
            `'View Hearing' page is not visible`
        );

        return this;
    }

    getHeaderText() {
        return this.header.getText();
    }

    getStatusText() {
        return this.status.getText();
    }

    async chooseAnActionFromDropDown(optionName: string) {
        this.helper.selectValueFromSingleSelectOption(this.actionsDropDown, optionName);
    }
}
