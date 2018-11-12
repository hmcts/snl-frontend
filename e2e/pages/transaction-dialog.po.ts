import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';

export class TransactionDialogPage {
    private parentElement = element(by.className('mat-dialog-container'));
    private actionCreationElement = this.parentElement.element(by.id('actionSummary'));
    private sessionButtonSelector = this.parentElement.element(by.cssContainingText('.mat-button-wrapper', 'Sessions'));
    private problemsDiv = element(by.id('problems'));

    async openSessionCreatePage() {
        await this.sessionButtonSelector.click();
        await element(by.linkText('Create')).click();
    }

    async clickAcceptButton(): Promise<any> {
        const acceptButton = element(by.id('okButton'));
        return await this.clickDialogButton(acceptButton, 'Accept')
    }

    async clickRollbackButton(): Promise<any> {
        const rollbackButton = element(by.id('rollbackButton'));
        await this.clickDialogButton(rollbackButton, 'Rollback');
        return await browser.wait(ExpectedConditions.invisibilityOf(this.parentElement))
    }

    async isActionCreationSummaryDisplayed(): Promise<boolean> {
        await browser.wait(
            ExpectedConditions.visibilityOf(this.actionCreationElement),
            Wait.normal,
            'Action Creation Summary is not visible'
        );
        return await this.actionCreationElement.isDisplayed();
    }

    async isProblemWithTextDisplayed(problemText: string): Promise<boolean> {
        await browser.wait(
            ExpectedConditions.visibilityOf(this.problemsDiv),
            Wait.normal,
            `Problem with text: ${problemText} is not visible`
        );
        const problemsDivText = await this.problemsDiv.getText();
        return await Promise.resolve(problemsDivText.indexOf(problemText) !== -1);
    }

    private async clickDialogButton(buttonElement: ElementFinder, buttonName: string) {
        await browser.wait(ExpectedConditions.presenceOf(buttonElement), Wait.normal);
        await browser.executeScript('arguments[0].scrollIntoView();', buttonElement.getWebElement());
        await browser.wait(ExpectedConditions.visibilityOf(buttonElement), Wait.long, `${buttonName} button is not visible`);
        await buttonElement.click();
        await browser.wait(ExpectedConditions.invisibilityOf(buttonElement), Wait.long, `${buttonElement} button wont disappear`);
        await browser.wait(ExpectedConditions.invisibilityOf(element(by.className('cdk-overlay-pane'))), Wait.long);
        return await browser.waitForAngular()
    }
}
