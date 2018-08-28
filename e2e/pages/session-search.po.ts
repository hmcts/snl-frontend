import { FilterSessionsComponentForm } from './../models/filter-sessions-component-form';
import { Judges } from '../enums/judges';
import { Rooms } from '../enums/rooms';
import { element, by } from 'protractor';
import { CaseTypes } from '../enums/case-types';
import { FilterSessionComponent } from '../components/filter-session';
import { Table } from '../components/table';
import { By } from 'selenium-webdriver';

export class SessionSearchPage {
    private filterSessionComponent = new FilterSessionComponent();
    private sessionsTable = new Table(element(by.id('sessions-table')));
    private listingRequestsTable = new Table(element(by.css('mat-table#hearing-part-preview')));
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
            element(by.cssContainingText('.mat-option-text', value)).click();
        });
    }

    async selectListingRequest(caseNumber: string, caseTitle: string, caseType: CaseTypes,
        targetScheduleFrom: string, targetScheduleTo: string) {
        this.selectCheckBoxInRowWithValues(this.listingRequestsTable, caseNumber, caseTitle, caseType, targetScheduleFrom, targetScheduleTo)
    }

    private selectCheckBoxInRowWithValues(table: Table, ...values: string[]) {
        this.clickElementInRowWithValues(table, by.css('mat-checkbox'), ...values)
    }


    public isListingRequestPresent(...values) {
        return this.listingRequestsTable.rowThatContains(...values).isPresent()
    }


    private clickElementInRowWithValues(table: Table, selector: By, ...values: string[]) {
      table.rowThatContains(...values).element(selector).click()
    }

  async clickDeleteListingRequest(caseNumber: string, caseTitle: string, caseType: CaseTypes,
                                  targetScheduleFrom: string, targetScheduleTo: string) {
    this.clickElementInRowWithValues(this.listingRequestsTable, by.css('.mat-column-delete .clickable'), caseNumber, caseTitle, caseType, targetScheduleFrom, targetScheduleTo)
  }

  async clickDeleteListingRequestByCaseNumber(caseNumber: string) {
    this.clickElementInRowWithValues(this.listingRequestsTable, by.css('.mat-column-delete .clickable'), caseNumber)
  }
}
