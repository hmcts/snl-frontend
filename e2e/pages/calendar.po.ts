import { by, element, browser, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';

export class CalendarPage {
  private calendarEntryClass = by.className('fc-list-item');

  async getNumberOfVisibleEvents(): Promise<number> {
    return await element.all(this.calendarEntryClass).count();
  }

  async openListView() {
    // Due some reasons events in calendar aren't displayed until some action will be taken
    // workaround for it is to select already selected view mode (month/week/day/list)
    await element(by.className('fc-listMonth-button')).click();
    await browser
      .wait(
        ExpectedConditions.visibilityOf(element.all(this.calendarEntryClass).first()),
        Wait.short
      )
      .catch(() => Promise.resolve(false));
  }

  async clickOnEventWith(startTime: string) {
    await element.all(by.cssContainingText('.fc-list-item-time', startTime)).last().click()
    const dialog = element(by.css('mat-dialog-container'))
    await browser.wait(ExpectedConditions.visibilityOf(dialog), Wait.normal, `Event with start time: ${startTime} haven't appear`)
  }
}
