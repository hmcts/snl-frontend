import { ElementFinder, by, element } from 'protractor';
import { filterSeries } from 'p-iteration';
import { Paginator } from './paginator';

export class Table {
  constructor(private parentElement: ElementFinder) {}

  async rowThatContainsAtAnyPage(paginator: Paginator, ...values: string[]): Promise<ElementFinder> {
    let row = await this.rowThatContains(...values);

    while (!row && await paginator.hasNextPage()) {
      await paginator.nextPageClick();
      row = await this.rowThatContains(...values);
    }

    return row;
  }

  private async rowThatContains(...values: string[]): Promise<ElementFinder> {
    const rows = await this.parentElement.all(by.css('mat-row')).asElementFinders_()
    const selectedRow = await filterSeries(rows, async (row: ElementFinder): Promise<boolean> => {
      const rowText = await row.getText()
      return await this.areValuesInText(rowText, values)
    })

    return selectedRow[0];
  }

  async rowById(id) {
    return await element(by.id(id));
  }

  private async areValuesInText(text: string, values: string[]): Promise<boolean> {
    return await values.reduce((previous, current) => {
      return text.indexOf(current) !== -1 && previous;
    }, true);
  }
}
