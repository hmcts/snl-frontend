import { element, by, ExpectedConditions, browser } from 'protractor';
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
    await browser.wait(ExpectedConditions.presenceOf(acceptButton), Wait.normal);
    await browser.executeScript('arguments[0].scrollIntoView();', acceptButton.getWebElement());
    await browser.wait(ExpectedConditions.visibilityOf(acceptButton), Wait.long, 'Accept button is not visible');
    await acceptButton.click();
    await browser.wait(ExpectedConditions.invisibilityOf(acceptButton), Wait.long, 'Accept button wont disappear');
    await browser.wait(ExpectedConditions.invisibilityOf(element(by.className('cdk-overlay-pane'))), Wait.long)
    return await browser.waitForAngular()
  }

  async isSessionCreationSummaryDisplayed(): Promise<boolean> {
    await browser.wait(
      ExpectedConditions.visibilityOf(this.summaryCreationElement),
      Wait.normal,
      'Session Creation Summary is not visible'
    );
    return await this.summaryCreationElement.isDisplayed();
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
}
