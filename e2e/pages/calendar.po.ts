import { browser, by, element, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';

export class CalendarPage {
    private calendarEntryClass = by.className('fc-list-item');

    async getNumberOfVisibleEvents(): Promise<number> {
        return await element.all(this.calendarEntryClass).count();
    }

    async clickNextButton() {
        await element(by.className('fc-next-button')).click();
    }

    async clickPrevButton() {
        await element(by.className('fc-prev-button')).click();
    }

    async openListView() {
        // Due some reasons events in calendar aren't displayed until some action will be taken
        // workaround for it is to select already selected view mode (month/week/day/list)
        await element(by.className('fc-listMonth-button')).click();
        await this.clickPrevButton();
        await this.clickNextButton();
        await browser
            .wait(
                ExpectedConditions.visibilityOf(element.all(this.calendarEntryClass).first()),
                Wait.short
            )
            .catch(() => Promise.resolve(false));
    }

    async clickOnEventWith(startTime: string) {
        const eventSelector = by.cssContainingText('.fc-list-item-time', startTime);
        await browser.wait(
            ExpectedConditions.presenceOf(element.all(eventSelector).last()),
            Wait.normal,
            `Event with start time: '${startTime}' is not present`);
        await element.all(eventSelector).last().click();
        const dialog = element(by.css('mat-dialog-container'));
        await browser.wait(ExpectedConditions.visibilityOf(dialog), Wait.normal, `Event with start time: ${startTime} haven't appear`)
    }
}
