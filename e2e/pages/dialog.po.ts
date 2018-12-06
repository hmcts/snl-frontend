import { browser, by, element, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';

export class DialogPage {
    private dialog = element(by.className('mat-dialog-container'));
    private okButton = this.dialog.element(by.cssContainingText('.mat-raised-button', 'Ok'));

    async clickOk() {
        await browser.wait(ExpectedConditions.visibilityOf(this.dialog),
            Wait.normal,
            'The pop-up did not appear');
        await browser.wait(ExpectedConditions.elementToBeClickable(this.okButton),
            Wait.normal,
            `'OK' button is not clickable`);
        await this.okButton.click();
    }
}
