import { FilterSessionsComponentForm } from './../models/filter-sessions-component-form';
import { Judges } from '../enums/judges';
import { Rooms } from '../enums/rooms';
import { element, by, browser, ExpectedConditions, ElementFinder } from 'protractor';
import { CaseTypes } from '../enums/case-types';
import { FilterSessionComponent } from '../components/filter-session';
import { Table } from '../components/table';
import { Wait } from '../enums/wait';
import { SessionTypes } from '../enums/session-types';
import { HearingTypes } from '../enums/hearing-types';
import { Paginator } from '../components/paginator';
import { Logger } from '../utils/logger';
import { ElementHelper } from '../utils/element-helper';

export class SessionSearchPage {
    private filterSessionComponent = new FilterSessionComponent();
    private elementHelper = new ElementHelper();
    private sessionsTable = new Table(element(by.id('sessions-table')));
    private sessionsTablePaginator = new Paginator(element(by.id('sessions-table-paginator')));
    private listingRequestsTable = new Table(element(by.id('hearings-part-table')));
    private listingRequestsTablePaginator = new Paginator(element(by.id('hearings-part-table-paginator')));
    public listingHearingStartTime = element(by.id('startTime'));
    private listHearingButton = element(by.id('listHearingButton'));
    public assignButton = element(by.id('assign'));

    async clickAssignButton() {
        await browser.wait(ExpectedConditions.elementToBeClickable(this.assignButton), Wait.normal, 'Assign button not visible')
        await this.assignButton.click()
    }

    async acceptAssignWithCurrentTime(time) {
        await browser.wait(ExpectedConditions.elementToBeClickable(this.listHearingButton), Wait.normal, 'List hearing button not visible');
        await this.elementHelper.typeValue(this.listingHearingStartTime, time);
        await this.listHearingButton.click()
    }

    async filterSession(formValues: FilterSessionsComponentForm) {
        await this.filterSessionComponent.filter(formValues);
    }

    async selectSession(judge: Judges, date: string, time: string, room: Rooms, sessionType?: SessionTypes) {
        await this.selectCheckBoxInRowWithValues(this.sessionsTable, this.sessionsTablePaginator,
          judge, date, time, room, sessionType)
    }

    async changeMaxItemsPerPage(value: string): Promise<any> {
        await element.all(by.css('.mat-paginator-page-size')).reduce(async (prom, el) => {
            await prom;
            const selectOption = el.element(by.css('mat-select'));
            await browser.executeScript('arguments[0].scrollIntoView();', selectOption.getWebElement());
            await browser.wait(ExpectedConditions.elementToBeClickable(selectOption))
            await selectOption.click();
            await browser.waitForAngular();
            const selectOpt = element(by.cssContainingText('.mat-option-text', value))
            await browser.wait(
                ExpectedConditions.elementToBeClickable(selectOpt),
                Wait.normal,
                `Option with text: ${value} is not clickable`
            )
            await selectOpt.click()
            return await browser.wait(
                ExpectedConditions.invisibilityOf(selectOpt),
                Wait.normal,
                `Option with text: ${value} wont disappear`
            )
        }, Promise.resolve());
    }

    async selectListingRequest(caseNumber: string, caseTitle: string, caseType: CaseTypes, hearingType: HearingTypes,
        targetScheduleFrom: string, targetScheduleTo: string) {
        await this.selectCheckBoxInRowWithValues(this.listingRequestsTable, this.listingRequestsTablePaginator,
            caseNumber, caseTitle, caseType, hearingType, targetScheduleFrom, targetScheduleTo)
    }

    async isListingRequestDisplayed(...values: string[]): Promise<boolean> {
      let row = await this.listingRequestsTable.rowThatContainsAtAnyPage(this.listingRequestsTablePaginator, ...values);
      await browser.wait(ExpectedConditions.visibilityOf(row), Wait.normal, `Listing request with values: ${values} is not visible`)

      return await row.isDisplayed()
    }

    async editListingRequestWithValues(...values: string[]): Promise<void> {
        const row = await this.listingRequestsTable.rowThatContainsAtAnyPage(this.listingRequestsTablePaginator, ...values)
        await browser.wait(ExpectedConditions.visibilityOf(row), Wait.normal, `Listing request with values: ${values} is not visible`)

        await row.element(by.cssContainingText('.clickable', 'Edit')).click()
    }

    async checkIfHasNote(expectedNoteId, expectedNoteValue, ...values: string[]): Promise<boolean> {
        Logger.log(`Checking if note exists. May fail when multiple notes of given id (${expectedNoteId}) are found`);

        const row = await this.listingRequestsTable.rowThatContainsAtAnyPage(this.listingRequestsTablePaginator, ...values)
        await browser.wait(ExpectedConditions.visibilityOf(row), Wait.normal, `Listing request with values: ${values} is not visible`)

        Logger.log('Clicking the notes indicator (By looking for the: \'Yes\' button)');
        await row.element(by.cssContainingText('.clickable', 'Yes')).click()

        let foundNotes: ElementFinder[] = await element(by.id('notesDialog'))
            .all(by.css('app-note'))
            .all(by.id(expectedNoteId))
            .all(by.id('note-textarea'))

        let foundNotesCount = await foundNotes.length;
        Logger.log(`Count of notes found for given id: ${foundNotesCount}`);

        Logger.log(`Obtaining THE FIRST note by given selector: ${expectedNoteId}`);
        let firstFoundNote = await foundNotes[0];

        let noteText = await firstFoundNote.getAttribute('value');
        Logger.log(`Obtained: ${noteText}. Expected: ${expectedNoteValue}. Obtained==Expected?: ${noteText === expectedNoteValue}`);

        await this.closeNotesDialog();

        return noteText === expectedNoteValue;
    }

    async waitUntilVisible() {
        await browser.wait(ExpectedConditions.visibilityOf(this.assignButton), Wait.normal, 'Session search page is not visible')
    }

    private async selectCheckBoxInRowWithValues(table: Table, paginator: Paginator, ...values: string[]) {
        let row = await table.rowThatContainsAtAnyPage(paginator, ...values)
        await browser.wait(ExpectedConditions.visibilityOf(row), Wait.normal, `Row with values: ${values} is not visible`)
        await row.element(by.css('mat-checkbox')).click()
    }

    private async closeNotesDialog() {
        return element(by.id('notesDialog')).element(by.cssContainingText('button', 'Close')).click();
    }
}
