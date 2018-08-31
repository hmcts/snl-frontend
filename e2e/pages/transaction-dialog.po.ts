import { element, by, promise, ExpectedConditions, browser } from 'protractor';
import { Wait } from '../enums/wait';

export class TransactionDialogPage {
  private parentElement = element(by.className('mat-dialog-container'));
  private summaryCreationElement = this.parentElement.element(by.id('sessionCreationSummary'));
  private sessionButtonSelector = this.parentElement.element(by.cssContainingText('.mat-button-wrapper', 'Sessions'));
  private problemsDiv = element(by.id('problems'));

  async openSessionCreatePage() {
    await this.sessionButtonSelector.click();
    await element(by.linkText('Create')).click();
  }

  async clickAcceptButton(): Promise<any> {
    const acceptButton = element(by.id('okButton'));
    await browser.wait(ExpectedConditions.visibilityOf(acceptButton), Wait.normal);
    await acceptButton.click();
    await browser.wait(ExpectedConditions.invisibilityOf(acceptButton), Wait.normal);
    return await browser.waitForAngular()
  }

  isDisplayed(): promise.Promise<boolean> {
    return this.parentElement.isDisplayed();
  }

  async isSessionCreationSummaryDisplayed(): Promise<boolean> {
    await browser.wait(
      ExpectedConditions.visibilityOf(this.summaryCreationElement),
      Wait.normal
    );
    return await this.summaryCreationElement.isDisplayed();
  }

  async isProblemWithTextDisplayed(problemText: string): Promise<boolean> {
    await browser.wait(
      ExpectedConditions.visibilityOf(this.problemsDiv),
      Wait.normal
    );
    const problemsDivText = await this.problemsDiv.getText();
    return await Promise.resolve(problemsDivText.indexOf(problemText) !== -1);
  }
}
