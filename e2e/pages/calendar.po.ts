import { by, element, browser, ExpectedConditions, promise } from 'protractor';
import { Wait } from '../enums/wait';

export class CalendarPage {
  private calendarEntryClass = by.className('fc-list-item');

  getNumberOfVisibleEvents(): promise.Promise<number> {
    return element.all(this.calendarEntryClass).count();
  }

  openListView() {
    // Due some reasons events in calendar aren't displayed until some action will be taken
    // workaround for it is to select already selected view mode (month/week/day/list)
    element(by.className('fc-listMonth-button')).click();
    browser
      .wait(
        ExpectedConditions.visibilityOf(element.all(this.calendarEntryClass).first()),
        Wait.short
      )
      .catch(() => Promise.resolve(false));
  }

  async clickOnEventWith(startTime: string) {
    element.all(by.cssContainingText('.fc-list-item-time', startTime)).last().click()
  }
}
