import { browser, by, element, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';
import { Table } from '../components/table';
import { Paginator } from '../components/paginator';

export class SearchListingRequestPage {
  // private parentElement = element(by.css('app-hearings-search'));
  private filterButton = element(by.id('filter'));

  // complete copy from session-search.po.ts
  private listingRequestsTable = new Table(element(by.id('hearings-part-table')));
  private listingRequestsTablePaginator = new Paginator(element(by.id('hearings-part-table-paginator')));

  async waitUntilVisible() {
    await browser.wait(
      ExpectedConditions.visibilityOf(this.filterButton),
      Wait.normal,
      'Search Listing Request page is not visible'
    );

    return this;
  }

  // complete copy from session-search.po.ts
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

  async isListingRequestDisplayed(...values: string[]): Promise<boolean> {
    let row = await this.listingRequestsTable.rowThatContainsAtAnyPage(this.listingRequestsTablePaginator, ...values);
    await browser.wait(ExpectedConditions.visibilityOf(row), Wait.normal, `Listing request with values: ${values} is not visible`)

    return await row.isDisplayed();
  }

  async clickFilterButton() {
    this.filterButton.click();
  }

  async clickListingRequest(id: string) {
    await element(by.id(`view-hearing-${id}`)).click();
  }
}