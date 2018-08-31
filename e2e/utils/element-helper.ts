import { ElementFinder, Key, element, by, ElementArrayFinder, ExpectedConditions, browser } from 'protractor';
import { Wait } from '../enums/wait';

export class ElementHelper {
  async clear(elem: ElementFinder, length?: number) {
    const inputText = await elem.getAttribute('value');
    length = length || inputText.length || 100;
    let backspaceSeries = '';
    for (let i = 0; i < length; i++) {
      backspaceSeries += Key.BACK_SPACE;
    }
    await elem.sendKeys(backspaceSeries);
  }

  async selectCheckbox(checkboxElement: ElementFinder, selected: boolean) {
    const isCheckboxSelected = await checkboxElement.isSelected();
    if (selected !== isCheckboxSelected) {
      await checkboxElement.click();
    }
  }

  async typeValue(htmlElement: ElementFinder, value: any): Promise<void> {
    await this.clear(htmlElement);
    await htmlElement.sendKeys(value);
  }

  async typeDate(dateInput: ElementFinder, date: string): Promise<void> {
    await dateInput.click();
    await this.clear(dateInput);
    return await dateInput.sendKeys(date);
  }

  async selectValueFromSingleSelectOption(selectOptionLocator: ElementFinder, textToSelect: string) {
    await selectOptionLocator.click();
    await element(by.cssContainingText('mat-option > span.mat-option-text', textToSelect))
      .click();
  }

  async selectValueFromMultipleSelectOption(selectOptionLocator: ElementFinder, textToSelect: string, loseFocusLocator: ElementFinder) {
    await browser.wait(ExpectedConditions.elementToBeClickable(selectOptionLocator), Wait.normal)
    await selectOptionLocator.click();
    const option = element(by.cssContainingText('mat-option > span.mat-option-text', textToSelect))
    await browser.wait(ExpectedConditions.elementToBeClickable(option), Wait.normal)
    await option.click();
    // dismiss popover with options
    await browser.wait(ExpectedConditions.elementToBeClickable(loseFocusLocator), Wait.normal)
    return await loseFocusLocator.click();
  }

  elementThatContains(elements: ElementArrayFinder, ...values: string[]): ElementFinder {
    return elements
      .filter(el => {
        return el.getText().then(text => {
          const isRowContainsPassedValues = values.reduce(
            (previous, current) => {
              return text.indexOf(current) !== -1 && previous;
            },
            true
          );
          return isRowContainsPassedValues;
        });
      })
      .first();
  }
}
