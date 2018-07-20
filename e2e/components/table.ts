import { ElementFinder, by } from 'protractor';

export class Table {
  constructor(private parentElement: ElementFinder) {}

  rowThatContains(...values: string[]): ElementFinder {
    return this.parentElement
      .all(by.css('mat-row'))
      .filter(el => {
        return el.getText().then(text => this.areValuesInText(text, values));
      })
      .first();
  }

  private areValuesInText(text: string, values: string[]): boolean {
    return values.reduce((previous, current) => {
      return text.indexOf(current) !== -1 && previous;
    }, true);
  }
}
