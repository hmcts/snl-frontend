import { FilterSessionsComponentForm } from './../models/filter-sessions-component-form';
import { Judges } from '../enums/judges';
import { Rooms } from '../enums/rooms';
import { element, by, promise, browser, ExpectedConditions } from 'protractor';
import { CaseTypes } from '../enums/case-types';
import { FilterSessionComponent } from '../components/filter-session';
import { Table } from '../components/table';

export class SessionSearchPage {
    private filterSessionComponent = new FilterSessionComponent();
    private sessionsTable = new Table(element(by.id('sessions-table')));
    private listingRequestsTable = new Table(element(by.css('app-hearing-parts-preview#hearing-part-preview')));
    public assignButton = element(by.id('assign'));

    filterSession(formValues: FilterSessionsComponentForm) {
        this.filterSessionComponent.filter(formValues);
    }

    async selectSession(judge: Judges, date: string, time: string, room: Rooms, caseType: CaseTypes) {
        this.selectCheckBoxInRowWithValues(this.sessionsTable, judge, date, time, room, caseType)
    }

    changeMaxItemsPerPage(value: string) {
        element.all(by.css('.mat-paginator-page-size')).each(el => {
            el.element(by.css('mat-select')).click();
            const selectOpt = element(by.cssContainingText('.mat-option-text', value))
            browser.wait(ExpectedConditions.elementToBeClickable(selectOpt), 3000)
            selectOpt.click();
        });
    }

    async selectListingRequest(caseNumber: string, caseTitle: string, caseType: CaseTypes,
        targetScheduleFrom: string, targetScheduleTo: string) {
        this.selectCheckBoxInRowWithValues(this.listingRequestsTable, caseNumber, caseTitle, caseType, targetScheduleFrom, targetScheduleTo)
    }

    isListingRequestDisplayed(...values: string[]): promise.Promise<boolean> {
        const row = this.listingRequestsTable.rowThatContains(...values)
        browser.wait(ExpectedConditions.visibilityOf(row), 3000)
        return row.isDisplayed()
    }

    editListingRequestWithValues(...values: string[]) {
        this.listingRequestsTable.rowThatContains(...values).element(by.cssContainingText('.clickable', 'edit')).click()
    }

    private selectCheckBoxInRowWithValues(table: Table, ...values: string[]) {
        table.rowThatContains(...values).element(by.css('mat-checkbox')).click()
    }
}
