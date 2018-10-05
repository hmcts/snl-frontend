import { browser, by, element, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';
import { Table } from '../components/table';
import { Logger } from '../utils/logger';
import { Paginator } from '../components/paginator';

export class ProblemsPage {
    private containerElement = element(by.css('app-problems-page'))
    public problemsTable = new Table(element(by.css('app-problems-table')));
    private problemsTablePaginator = new Paginator(element(by.id('problems-table-paginator')));

    async waitUntilVisible() {
        Logger.log(`Waiting for Problems page to be visible`);
        await browser.wait(ExpectedConditions.visibilityOf(this.containerElement), Wait.normal, 'Problems page is not visible');
    }

    async isProblemDisplayed(values: string[]): Promise<boolean> {
        Logger.log(`Checking if problem with values: '${values}' is displayed`);

        const row = await this.problemsTable.rowThatContainsAtAnyPage(this.problemsTablePaginator, ...values);
        await browser.wait(ExpectedConditions.presenceOf(row), Wait.normal, `Problem row with values: '${values}' is not present`);
        return await row.isPresent();
    }

    async getNumberOfProblems() {
        Logger.log(`Getting number of problem from paginator element`);
        const paginatorRangeElement = element(by.className('mat-paginator-range-label'))
        await browser.wait(ExpectedConditions.visibilityOf(paginatorRangeElement), Wait.normal)
        const paginationRangeText = await paginatorRangeElement.getText()
        const totalNumberOfProblems = paginationRangeText.split('of').pop().trim()
        Logger.log(`Number of problems in paginator: ${totalNumberOfProblems}`);
        return +totalNumberOfProblems
    }
}
