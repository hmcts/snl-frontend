import { element, by, ExpectedConditions, browser } from 'protractor';
import { Wait } from '../enums/wait';

export class DeleteHearingPartDialogPage {
  private yesButton = element(by.buttonText('Ok'))

  clickYesButton(): any {
    browser.wait(
      ExpectedConditions.visibilityOf(this.yesButton),
      Wait.normal
    )

    this.yesButton.click();
  }
}
