import { ElementHelper } from '../utils/element-helper';
import { by, element, promise } from 'protractor';

export class SessionDetailsDialogPage {
  private elementHelper = new ElementHelper();

  isDialogWithTextsDisplayed(...text: string[]): promise.Promise<boolean> {
    const eventsWrapper = element.all(by.css('app-details-dialog'));
    return this.elementHelper
      .elementThatContains(eventsWrapper, ...text)
      .isDisplayed();
  }

  close() {
    element(by.id('close')).click();
  }
}
