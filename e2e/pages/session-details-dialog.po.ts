import { ElementHelper } from '../utils/element-helper';
import { by, element } from 'protractor';

export class SessionDetailsDialogPage {
  private elementHelper = new ElementHelper();

  async isDialogWithTextsDisplayed(...text: string[]): Promise<boolean> {
    const eventsWrapper = element.all(by.css('app-details-dialog'));
    const elementWithValues = await this.elementHelper.elementThatContains(eventsWrapper, ...text);
    return await elementWithValues.isDisplayed();
  }

  async close() {
    await element(by.id('close')).click();
  }
}
