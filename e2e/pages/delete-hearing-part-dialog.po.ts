import { element, by, ExpectedConditions, browser } from 'protractor';
import { Wait } from '../enums/wait';

export class DeleteHearingPartDialogPage {
  private yesButton = element(by.id('delete-hearing-part-yes'))

  clickYesButton(): any {
    browser.wait(
      ExpectedConditions.visibilityOf(this.yesButton),
      Wait.normal
    )

    this.yesButton.click();
  }
}
