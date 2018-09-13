import { ElementFinder, by, element } from 'protractor';
import { filterSeries } from 'p-iteration';

export class Table {
  constructor(private parentElement: ElementFinder) {}

  async rowThatContains(...values: string[]): Promise<ElementFinder> {
    const rows = await this.parentElement.all(by.css('mat-row')).asElementFinders_()
    const selectedRow = await filterSeries(rows, async (row: ElementFinder): Promise<boolean> => {
      const rowText = await row.getText()
      return this.areValuesInText(rowText, values)
    })

    return selectedRow[0];
  }

  async rowById(id) {
    return await element(by.id(id));
  }

  private areValuesInText(text: string, values: string[]): boolean {
    return values.reduce((previous, current) => {
      return text.indexOf(current) !== -1 && previous;
    }, true);
  }
}
