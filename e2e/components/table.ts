import { ElementFinder, by } from 'protractor';
import { filterSeries } from 'p-iteration';
import { Paginator } from './paginator';
import { Logger } from '../utils/logger';

export class Table {
  constructor(private parentElement: ElementFinder) {}

  async isRowWithIdPresentAtAnyPage(paginator: Paginator, id: string): Promise<boolean> {
    let isRowWithIdPresent = await this.isRowWithIdPresent(id)

    while (!isRowWithIdPresent && await paginator.hasNextPage()) {
      await paginator.nextPageClick();
      isRowWithIdPresent = await this.isRowWithIdPresent(id);
    }

    if (!isRowWithIdPresent) {
      Logger.log(`Row with id = ${id} is not present!`)
    }

    return isRowWithIdPresent;
  }

  async rowThatContainsAtAnyPage(paginator: Paginator, ...values: string[]): Promise<ElementFinder> {
    let row = await this.rowThatContains(...values);

    while (!row && await paginator.hasNextPage()) {
      await paginator.nextPageClick();
      row = await this.rowThatContains(...values);
    }

    return row;
  }

  async isRowWithIdPresent(id: string): Promise<boolean> {
    return await this.parentElement.element(by.id(id)).isPresent();
  }

  async rowThatContains(...values: string[]): Promise<ElementFinder> {
    const rows = await this.parentElement.all(by.css('mat-row')).asElementFinders_()
    const selectedRow = await filterSeries(rows, async (row: ElementFinder): Promise<boolean> => {
      const rowText = await row.getText()
      return await this.areValuesInText(rowText, values)
    })

    return selectedRow[0];
  }

  private async areValuesInText(text: string, values: string[]): Promise<boolean> {
    return await values.reduce((previous, current) => {
      return text.indexOf(current) !== -1 && previous;
    }, true);
  }
}
