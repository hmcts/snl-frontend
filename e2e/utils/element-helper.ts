import { ElementFinder, Key, element, by, ElementArrayFinder } from 'protractor';

export class ElementHelper {
    async clear(elem: ElementFinder, length?: number) {
        const inputText = await elem.getAttribute('value')
        length = length || inputText.length || 100
        let backspaceSeries = '';
        for (let i = 0; i < length; i++) {
            backspaceSeries += Key.BACK_SPACE;
        }
        elem.sendKeys(backspaceSeries);
    }

    async selectCheckbox(checkboxElement: ElementFinder, selected: boolean) {
        const isCheckboxSelected = await checkboxElement.isSelected()
        if (selected !== isCheckboxSelected) {
            checkboxElement.click()
        }
    }

    typeValue(htmlElement: ElementFinder, value: any) {
        this.clear(htmlElement);
        htmlElement.sendKeys(value)
    }

    typeDate(dateInput: ElementFinder, date: string) {
        dateInput.click()
        this.clear(dateInput);
        dateInput.sendKeys(date)
    }

    selectValueFromSelectOption(selectOptionLocator: ElementFinder, textToSelect: string) {
        selectOptionLocator.click()
        element(by.cssContainingText('mat-option > span.mat-option-text', textToSelect)).click()
        // dismiss popover with options
        element(by.css('body')).click()
    }

    elementThatContains(elements: ElementArrayFinder, ...values: string[]): ElementFinder {
        return elements.filter(el => {
            return el.getText().then(text => {
              const isRowContainsPassedValues = values.reduce(
                (previous, current) => {
                  return text.indexOf(current) !== -1 && previous;
                },
                true
              );
              console.log(`if text = ${text} contains ${values} == ${isRowContainsPassedValues}`)
              return isRowContainsPassedValues;
            });
          }).first();
      }
}
