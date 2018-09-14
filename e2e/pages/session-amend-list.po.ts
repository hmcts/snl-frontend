import { browser, by, element, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';
import { FilterSessionComponent } from '../components/filter-session';
import { Table } from '../components/table';

export class SessionAmendListPage {
    private filterSessionComponent = new FilterSessionComponent();
    private sessionsTable = new Table(element(by.id('sessions-table')));

    public noSessionsTitle = element(by.cssContainingText('.heading', 'Sessions:'));

    async filterSession(values) {
        await this.filterSessionComponent.filter(values);
    }

    async waitUntilVisible() {
        await browser.wait(ExpectedConditions.visibilityOf(this.noSessionsTitle), Wait.normal, 'Session search page is not visible');
    }

    async isSessionDisplayed(id: string): Promise<boolean> {
        const row = await this.sessionsTable.rowById(id);
        await browser.wait(ExpectedConditions.presenceOf(row), Wait.normal, `Session with id: ${id} is not present`);
        return await row.isPresent();
    }

    async amendSession(id: string) {
        const row = await this.sessionsTable.rowById(id);
        await browser.wait(ExpectedConditions.presenceOf(row), Wait.normal, 'Session is not present');
        await element(by.id(`amend-button-${id}`)).click();

    }
}
