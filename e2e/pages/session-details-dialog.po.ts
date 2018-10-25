import { ElementHelper } from '../utils/element-helper';
import { browser, by, element, ExpectedConditions } from 'protractor';
import { Logger } from '../utils/logger';

export class SessionDetailsDialogPage {
  private elementHelper = new ElementHelper();

  async isDialogWithTextsDisplayed(...text: string[]): Promise<boolean> {
    Logger.log(`Verifying if Session Details Dialog is displayed with values: ${JSON.stringify(text)}`)
    const eventsWrapper = await element(by.css('app-details-dialog'));
    await this.elementHelper.browserWaitElementVisible(eventsWrapper);
    let containsProperText = true;
    const dialogText = await eventsWrapper.getText();
    Logger.log(`Session Details Dialog inner text: ${dialogText}`)

    text.forEach(textEntry => {
      Logger.log(`Verifying if inner Session Details Dialog text includes: ${textEntry}`)
      if (!dialogText.includes(textEntry)) {
          Logger.log(`Inner Session Details Dialog text DOES NOT INCLUDE: ${textEntry}`)
          containsProperText = false;
      }
    });
    return await eventsWrapper.isDisplayed() && containsProperText;
  }

  async close() {
    await element(by.id('close')).click();
    await browser.wait(ExpectedConditions.invisibilityOf(element(by.css('app-details-dialog'))));
  }
}
