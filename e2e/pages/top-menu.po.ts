import { element, by, browser, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';

export class TopMenu {
    private parentElement = element(by.css('mat-toolbar-row'))
    private sessionButtonSelector = by.cssContainingText('.mat-button-wrapper', 'Sessions')
    private calendarButtonSelector = by.cssContainingText('.mat-button-wrapper', 'Calendar')
    private listingNewButtonSelector = by.cssContainingText('.mat-button-wrapper', 'Listing (new)')

    openSessionCreatePage() {
        this.parentElement.element(this.sessionButtonSelector).click()
        const createMenuButton = element(by.linkText('Create'))
        browser.wait(ExpectedConditions.presenceOf(createMenuButton), Wait.normal, 'Cant find Create menu button')
        createMenuButton.click()
    }

    openCalendarPage() {
        browser.wait(ExpectedConditions.presenceOf(element(this.calendarButtonSelector)), Wait.normal, 'Cant find Calendar menu button')
        this.parentElement.element(this.calendarButtonSelector).click()
    }

    openNewListingCreationPage() {
        this.parentElement.element(this.listingNewButtonSelector).click()
    }

    openSessionSearchPage() {
        this.parentElement.element(this.sessionButtonSelector).click()
        const searchMenuButton = element(by.linkText('Search'))
        browser.wait(ExpectedConditions.presenceOf(searchMenuButton), 5000, 'Cant find Search menu button')
        searchMenuButton.click()
    }
}
