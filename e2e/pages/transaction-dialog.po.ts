import { element, by, promise, ExpectedConditions, browser } from 'protractor';
import { Wait } from '../enums/wait';

export class TransactionDialogPage {
  private parentElement = element(by.className('mat-dialog-container'));
  private summaryCreationElement = this.parentElement.element(by.id('sessionCreationSummary'));
  private sessionButtonSelector = this.parentElement.element(by.cssContainingText('.mat-button-wrapper', 'Sessions'));
  private problemsDiv = element(by.id('problems'));

  openSessionCreatePage() {
    this.sessionButtonSelector.click();
    element(by.linkText('Create')).click();
  }

  clickAcceptButton(): any {
    const acceptButton = element(by.id('okButton'));
    browser.wait(ExpectedConditions.visibilityOf(acceptButton), Wait.normal);
    acceptButton.click();
  }

  isDisplayed(): promise.Promise<boolean> {
    return this.parentElement.isDisplayed();
  }

  isSessionCreationSummaryDisplayed(): promise.Promise<boolean> {
    browser.wait(
      ExpectedConditions.visibilityOf(this.summaryCreationElement),
      Wait.normal
    );
    return this.summaryCreationElement.isDisplayed();
  }

  async isProblemWithTextDisplayed(problemText: string): Promise<boolean> {
    browser.wait(
      ExpectedConditions.visibilityOf(this.problemsDiv),
      Wait.normal
    );
    const problemsDivText = await this.problemsDiv.getText();
    return Promise.resolve(problemsDivText.indexOf(problemText) !== -1);
  }
}
