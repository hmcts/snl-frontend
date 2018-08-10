import { element, by, browser, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';

export class TopMenu {
  private parentElement = element(by.css('mat-toolbar-row'));
  private listingsButtonSelector = by.cssContainingText('.mat-button-wrapper', 'Listings');
  private calendarButtonSelector = by.cssContainingText('.mat-button-wrapper', 'Calendar');

  openNewSessionPage() {
    this.openListingSubMenu('New Session');
  }

  openNewListingRequestPage() {
    this.openListingSubMenu('New Listing Request');
  }

  openListHearingPage() {
    this.openListingSubMenu('List Hearings');
  }

  openCalendarPage() {
    browser.wait(
      ExpectedConditions.presenceOf(element(this.calendarButtonSelector)),
      Wait.normal,
      'Cant find Calendar menu button'
    );
    this.parentElement.element(this.calendarButtonSelector).click();
  }

  private openListingSubMenu(optionName: string) {
    this.parentElement.element(this.listingsButtonSelector).click();
    const subElement = element(by.linkText(optionName));
    browser.wait(
      ExpectedConditions.presenceOf(subElement),
      Wait.normal,
      `Cant find ${optionName} menu button`
    );
    subElement.click();
  }
}
