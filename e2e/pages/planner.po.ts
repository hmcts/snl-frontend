import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';
import moment = require('moment');

export class PlannerPage {
    private timelineEvent = by.className('fc-timeline-event');
    private plannerTitle = element(by.tagName('h2'));

    async getNumberOfVisibleEvents(): Promise<number> {
        return await element.all(this.timelineEvent).count();
    }

    async clickNextButton() {
        await element(by.className('fc-next-button')).click();
    }

    async clickPrevButton() {
        await element(by.className('fc-prev-button')).click();
    }

    async clickJudgeViewButton() {
        await element(by.id('planner-judge-view-btn')).click();
    }

    async clickRoomViewButton() {
        await element(by.id('planner-room-view-btn')).click();
    }

    async clickTodayButton() {
        await element(by.className('fc-today-button')).click();
    }

    async openDayView() {
        // Due some reasons events in calendar aren't displayed until some action will be taken
        // workaround for it is to select already selected view mode (month/week/day/list)
        await element(by.className('fc-timelineDay-button')).click();
        await this.clickPrevButton();
        await this.clickNextButton();
        await browser
            .wait(
                ExpectedConditions.visibilityOf(element.all(this.timelineEvent).first()),
                Wait.short
            )
            .catch(() => Promise.resolve(false));
    }

    async waitUntilVisible() {
        moment().isoWeekYear();
        let expectedDate = moment().day(0).format('DD/MM') + ' - ' + moment().day(6).format('DD/MM/YYYY');
        await browser.wait(ExpectedConditions.visibilityOf(this.plannerTitle), Wait.normal, expectedDate);
    }

    async getResourceIdByName(nameToSearch: string): Promise<string> {
        return await element.all(by.className('fc-resource-area'))
            .last()
            .all(by.tagName('tr'))
            .filter(tr => {
                return tr.element(by.className('fc-cell-text')).getText().then(value => {
                    return value === nameToSearch;
                });
            })
            .first()
            .getAttribute('data-resource-id');
    }

    getRowWithEventsByResource(resourceId: string) {
        return element.all(by.className('fc-time-area'))
            .last()
            .all(by.tagName('tr'))
            .filter(el => {
                return el.getAttribute('data-resource-id').then(value => {
                    return value === resourceId;
                });
            })
            .first();
    }

    getAllEventsForTheResource(resourceId: string) {
        return this.getRowWithEventsByResource(resourceId)
            .all(by.className('fc-title'));
    }

    async clickOnEvent(elementToClick: ElementFinder, values: string[]) {
        await elementToClick.click();
        const dialog = element(by.css('mat-dialog-container'));
        await browser.wait(ExpectedConditions.visibilityOf(dialog), Wait.normal, `Event with values [ ${values.join(', ')} ] haven't appear`)
    }
}
