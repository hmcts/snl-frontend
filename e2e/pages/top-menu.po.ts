import { ListingCreationPage } from './listing-creation.po';
import { SessionCreationPage } from './session-creation.po';
import { element, by, browser, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';
import { SessionSearchPage } from './session-search.po';

export class TopMenu {
  private parentElement = element(by.css('mat-toolbar-row'));
  private listingsButtonSelector = by.cssContainingText('.mat-button-wrapper', 'Listings');
  private calendarButtonSelector = by.cssContainingText('.mat-button-wrapper', 'Calendar');
  private logoutButtonElement = element(by.cssContainingText('.mat-button-wrapper', 'Logout'))
  private sessionCreatePage = new SessionCreationPage()
  private sessionSearchPage = new SessionSearchPage()
  private listingCreatePage = new ListingCreationPage()

  async openNewSessionPage() {
    await this.openListingSubMenu('New Session');
    await this.sessionCreatePage.waitUntilVisible()
  }

  async openNewListingRequestPage() {
   await this.openListingSubMenu('New Listing Request');
   await this.listingCreatePage.waitUntilVisible()
  }

  async openListHearingPage(): Promise<void> {
    await this.openListingSubMenu('List Hearings');
    await this.sessionSearchPage.waitUntilVisible()
  }

  async openCalendarPage() {
    await browser.wait(
      ExpectedConditions.presenceOf(element(this.calendarButtonSelector)),
      Wait.normal,
      'Cant find Calendar menu button'
    );
    await this.parentElement.element(this.calendarButtonSelector).click();
  }

  async clickOnLogoutButton() {
    await this.logoutButtonElement.click()
  }

  private async openListingSubMenu(optionName: string): Promise<void> {
    await this.parentElement.element(this.listingsButtonSelector).click();
    const subElement = element(by.linkText(optionName));
    await browser.wait(
      ExpectedConditions.elementToBeClickable(subElement),
      Wait.normal,
      `Cant find ${optionName} menu button`
    );
    await subElement.click();
  }
}
