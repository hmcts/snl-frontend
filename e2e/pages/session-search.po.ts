import { FilterSessionsComponentForm } from './../models/filter-sessions-component-form';
import { Judges } from '../enums/judges';
import { Rooms } from '../enums/rooms';
import { element, by } from 'protractor';
import { CaseTypes } from '../enums/case-types';
import { FilterSessionComponent } from '../components/filter-session';
import { Table } from '../components/table';

export class SessionSearchPage {
  private filterSessionComponent = new FilterSessionComponent();
  private sessionsTable = new Table(element(by.id('sessions-table')))
  private listingRequestsTable = new Table(element(by.id('hearing-part-preview')))
  public assignButton = element(by.id('assign'));

  filterSession(formValues: FilterSessionsComponentForm) {
    this.filterSessionComponent.filter(formValues);
  }

  async selectSession(judge: Judges, date: string, time: string, room: Rooms, caseType: CaseTypes) {
    this.selectCheckBoxInRowWithValues(this.sessionsTable, judge, date, time, room, caseType)
  }

  async selectListingRequest(caseNumber: string, caseTitle: string, caseType: CaseTypes,
    targetScheduleFrom: string, targetScheduleTo: string) {
      this.selectCheckBoxInRowWithValues(this.listingRequestsTable, caseNumber, caseTitle, caseType, targetScheduleFrom, targetScheduleTo)
  }

  private selectCheckBoxInRowWithValues(table: Table, ...values: string[]) {
    table.rowThatContains(...values).element(by.css('mat-checkbox')).click()
  }
}
