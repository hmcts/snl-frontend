import { browser, by, element, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';
import { FilterSessionComponent } from '../components/filter-session';
import { Table } from '../components/table';
import { Paginator } from '../components/paginator';

export class SessionAmendListPage {
    private filterSessionComponent = new FilterSessionComponent();
    public sessionsTable = new Table(element(by.id('sessions-table')));
    private sessionsTableTablePaginator = new Paginator(element(by.id('session-search-table-paginator')));
    public noSessionsTitle = element(by.cssContainingText('.heading', 'Sessions:'));

    async filterSession(values) {
        await this.filterSessionComponent.filter(values);
    }

    async waitUntilVisible() {
        await browser.wait(ExpectedConditions.visibilityOf(this.noSessionsTitle), Wait.normal, 'Session search page is not visible');
    }

    async isSessionDisplayed(id: string): Promise<boolean> {
        return await this.sessionsTable.isRowWithIdPresentAtAnyPage(this.sessionsTableTablePaginator, id);
    }

    async amendSession(id: string) {
        await this.isSessionDisplayed(id);
        await element(by.id(`amend-button-${id}`)).click();
    }
}
