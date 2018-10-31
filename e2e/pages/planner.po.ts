import { browser, by, element, ElementFinder, ExpectedConditions, WebElement } from 'protractor';
import { Wait } from '../enums/wait';
import moment = require('moment');
import { Logger } from '../utils/logger';
import { SessionDetailsDialogPage } from './session-details-dialog.po';
import { filterSeries } from 'p-iteration';

export class PlannerPage {
    private sessionDetailsDialog = new SessionDetailsDialogPage();
    private timelineEvent = by.className('fc-timeline-event');
    private plannerTitle = element(by.tagName('h2'));
    private dayButton = element(by.className('fc-timelineDay-button'));
    private todayButton = element(by.className('fc-today-button'));

    async getNumberOfVisibleEvents(): Promise<number> {
        await this.waitForCalendarToLoadEvents();
        return await element.all(this.timelineEvent).count();
    }

    private async waitForCalendarToLoadEvents() {
        await browser
            .wait(
                ExpectedConditions.visibilityOf(element.all(this.timelineEvent).first()),
                Wait.short
            )
            .catch(() => Promise.resolve(false));
    }

    async clickNextButton() {
        await element(by.className('fc-next-button')).click();
        Logger.log('"Next" button clicked')
    }

    async clickPrevButton() {
        await element(by.className('fc-prev-button')).click();
        Logger.log('"Previous" button clicked')
    }

    async clickJudgeViewButton() {
        await element(by.id('planner-judge-view-btn')).click();
        Logger.log('"Judge view" button clicked')
    }

    async clickRoomViewButton() {
        await element(by.id('planner-room-view-btn')).click();
        Logger.log('"Room view" button clicked')
    }

    async clickTodayButton() {
        await browser.wait(ExpectedConditions.elementToBeClickable(this.todayButton))
        await this.todayButton.click();
        Logger.log('"Today" button clicked')
    }

    async openDayView() {
        // Due some reasons events in calendar aren't displayed until some action will be taken
        // workaround for it is to select already selected view mode (month/week/day/list)
        await browser.wait(ExpectedConditions.elementToBeClickable(this.dayButton))
        await this.dayButton.click();
        await this.clickPrevButton();
        await this.clickNextButton();
        await this.waitForCalendarToLoadEvents();
    }

    async waitUntilPlannerIsLoadedAndVisible() {
        let currentWeekDateRange = moment().day(0).format('DD/MM') + ' - ' + moment().day(6).format('DD/MM/YYYY');
        await browser.wait(ExpectedConditions.visibilityOf(this.plannerTitle), Wait.normal, currentWeekDateRange);
        await this.waitForCalendarToLoadEvents();
    }

    async getResourceIdByName(nameToSearch: string): Promise<string> {
        const trs = await element.all(by.className('fc-resource-area'))
            .last()
            .all(by.tagName('tr')).getWebElements();

        const filteredTrs = await filterSeries(trs, async (tr) => {
            const value = await tr.findElement(by.className('fc-cell-text')).getText()
            return value === nameToSearch;
        });

        const dataResourceId = await filteredTrs[0].getAttribute('data-resource-id')
        Logger.log('"' + nameToSearch + '" resource id: ' + dataResourceId);
        return dataResourceId;
    }

    async getRowWithEventsByResource(resourceId: string): Promise<WebElement> {
        const trs = await element.all(by.className('fc-time-area'))
            .last()
            .all(by.tagName('tr')).getWebElements();

        const filteredTrs = await filterSeries(trs, async (tr) => {
            const value = await tr.getAttribute('data-resource-id')
            return value === resourceId;
        });

        return filteredTrs[0];
    }

    async getAllEventsForTheResource(resourceId: string): Promise<WebElement[]> {
        const row = await this.getRowWithEventsByResource(resourceId)
        return await row.findElements(by.className('fc-title'))
    }

    async clickOnEvent(elementToClick: ElementFinder, values: string[]) {
        await elementToClick.click();
        const dialog = element(by.css('mat-dialog-container'));
        await browser.wait(ExpectedConditions.visibilityOf(dialog),
            Wait.normal,
            `Event with values [ ${values.join(', ')} ] didn't appear`
        );
    }

    async getSessionEventById(id: string): Promise<ElementFinder> {
        return await element(by.id(id)).element(by.xpath('..'));
    }

    async getSessionEventTextById(id: string): Promise<string> {
        return await (await this.getSessionEventById(id)).getText();
    }

    async clickAndValidateDialogContent(event: ElementFinder, valuesToCheck: string[]) {
        await this.clickOnEvent(event, valuesToCheck);
        const isDialogDisplayed = await this.sessionDetailsDialog.isDialogWithTextsDisplayed(...valuesToCheck);
        await expect(isDialogDisplayed).toBeTruthy();
        await this.sessionDetailsDialog.close();
    }
}