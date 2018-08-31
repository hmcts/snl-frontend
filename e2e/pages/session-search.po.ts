import { FilterSessionsComponentForm } from './../models/filter-sessions-component-form';
import { Judges } from '../enums/judges';
import { Rooms } from '../enums/rooms';
import { element, by, browser, ExpectedConditions } from 'protractor';
import { CaseTypes } from '../enums/case-types';
import { FilterSessionComponent } from '../components/filter-session';
import { Table } from '../components/table';
import { Wait } from '../enums/wait';

export class SessionSearchPage {
    private filterSessionComponent = new FilterSessionComponent();
    private sessionsTable = new Table(element(by.id('sessions-table')));
    private listingRequestsTable = new Table(element(by.css('app-hearing-parts-preview#hearing-part-preview')));
    public assignButton = element(by.id('assign'));

    async filterSession(formValues: FilterSessionsComponentForm) {
        await this.filterSessionComponent.filter(formValues);
    }

    async selectSession(judge: Judges, date: string, time: string, room: Rooms, caseType: CaseTypes) {
        await this.selectCheckBoxInRowWithValues(this.sessionsTable, judge, date, time, room, caseType)
    }

    async changeMaxItemsPerPage(value: string): Promise<any> {
        await element.all(by.css('.mat-paginator-page-size')).reduce(async (prom, el) => {
            await prom;
            await el.element(by.css('mat-select')).click();
            const selectOpt = element(by.cssContainingText('.mat-option-text', value))
            await browser.wait(ExpectedConditions.elementToBeClickable(selectOpt), Wait.normal)
            await selectOpt.click()
            return await browser.wait(ExpectedConditions.invisibilityOf(selectOpt), Wait.normal)
        }, Promise.resolve());
    }

    async selectListingRequest(caseNumber: string, caseTitle: string, caseType: CaseTypes,
        targetScheduleFrom: string, targetScheduleTo: string) {
        await this.selectCheckBoxInRowWithValues(this.listingRequestsTable,
            caseNumber, caseTitle, caseType, targetScheduleFrom, targetScheduleTo)
    }

    async isListingRequestDisplayed(...values: string[]): Promise<boolean> {
        const row = await this.listingRequestsTable.rowThatContains(...values)
        await browser.wait(ExpectedConditions.visibilityOf(row), Wait.normal)
        return await row.isDisplayed()
    }

    async editListingRequestWithValues(...values: string[]): Promise<void> {
        const row = await this.listingRequestsTable.rowThatContains(...values)
        await row.element(by.cssContainingText('.clickable', 'edit')).click()
    }

    async waitUntilVisible() {
        await browser.wait(ExpectedConditions.visibilityOf(this.assignButton), Wait.normal)
    }

    private async selectCheckBoxInRowWithValues(table: Table, ...values: string[]) {
        const row = await table.rowThatContains(...values)
        await row.element(by.css('mat-checkbox')).click()
    }
}
