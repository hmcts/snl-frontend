import { browser, by, element, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';
import { Table } from '../components/table';
import { Paginator } from '../components/paginator';

export class SearchListingRequestPage {
    private filterButton = element(by.id('filter'));

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

    async isListingRequestDisplayed(...values: string[]): Promise<boolean> {
        let row = await this.listingRequestsTable.rowThatContainsAtAnyPage(this.listingRequestsTablePaginator, ...values);
        await browser.wait(ExpectedConditions.visibilityOf(row), Wait.normal, `Listing request with values: ${values} is not visible`)

        return await row.isDisplayed();
    }

    async clickFilterButton() {
        await this.filterButton.click();
    }

    async clickListingRequest(id: string) {
        await element(by.id(`view-hearing-${id}`)).click();
    }
}
