import { ListingCreationPage } from './listing-creation.po';
import { SessionCreationPage } from './session-creation.po';
import { element, by, browser, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';
import { SessionSearchPage } from './session-search.po';
import { SessionAmendListPage } from './session-amend-list.po';
import { ProblemsPage } from './problems.po';
import { PlannerPage } from './planner.po';

export class TopMenu {
  private parentElement = element(by.css('nav.hmcts-primary-navigation'));
  private listingsButtonSelector = by.cssContainingText('.hmcts-primary-navigation__link', 'Listings');
  private calendarButtonSelector = by.cssContainingText('.hmcts-primary-navigation__link', 'Calendar');
  private problemsButtonElement = element(by.cssContainingText('.hmcts-primary-navigation__link', 'Problems'));
  private logoutButtonElement = element(by.cssContainingText('.hmcts-header__navigation-link', 'Logout'))
  private plannerButtonElement = element(by.cssContainingText('.hmcts-primary-navigation__link', 'Planner'));
  private sessionCreatePage = new SessionCreationPage()
  private sessionSearchPage = new SessionSearchPage()
  private listingCreatePage = new ListingCreationPage()
  private sessionAmendListPage = new SessionAmendListPage();
  private problemsPage = new ProblemsPage();
  private plannerPage = new PlannerPage();

  async openNewSessionPage() {
    await this.openListingSubMenu('New Session');
    await this.sessionCreatePage.waitUntilVisible();
  }

  async openNewListingRequestPage() {
   await this.openListingSubMenu('New Listing Request');
   await this.listingCreatePage.waitUntilVisible();
  }

  async openListHearingPage(): Promise<void> {
    await this.openListingSubMenu('List Hearings');
    await this.sessionSearchPage.waitUntilVisible();
  }

  async openSessionsAmendListPage(): Promise<void> {
      await this.openListingSubMenu('Search Sessions');
      await this.sessionAmendListPage.waitUntilVisible();
  }

  async openPlannerPage(): Promise<void> {
      await browser.wait(ExpectedConditions.elementToBeClickable(this.plannerButtonElement), Wait.normal);
      await this.plannerButtonElement.click();
      await this.plannerPage.waitUntilPlannerIsLoadedAndVisible();
  }

  async openCalendarPage() {
    await browser.wait(
      ExpectedConditions.elementToBeClickable(element(this.calendarButtonSelector)),
      Wait.normal,
      'Cant find Calendar menu button'
    );
    await this.parentElement.element(this.calendarButtonSelector).click();
  }

  async clickOnLogoutButton() {
    await this.logoutButtonElement.click();
  }

  async openProblemsPage() {
    await browser.wait(ExpectedConditions.elementToBeClickable(this.problemsButtonElement), Wait.normal);
    await this.problemsButtonElement.click();
    await this.problemsPage.waitUntilVisible();
  }

  private async openListingSubMenu(optionName: string): Promise<void> {
    const listings = this.parentElement.element(this.listingsButtonSelector);
    await browser.wait(
      ExpectedConditions.elementToBeClickable(listings),
      Wait.normal,
      'Cant find Listings menu button'
    );
    await listings.click();

    const subElement = element(by.linkText(optionName));
    await browser.wait(
      ExpectedConditions.elementToBeClickable(subElement),
      Wait.normal,
      `Cant find ${optionName} menu button`
    );
    await subElement.click();
  }
}
