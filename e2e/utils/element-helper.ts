import { browser, by, element, ElementArrayFinder, ElementFinder, ExpectedConditions } from 'protractor';
import { Wait } from '../enums/wait';
import { Logger } from './logger';
import { promise as wdpromise } from 'selenium-webdriver'

export class ElementHelper {
    async selectCheckbox(checkboxElement: ElementFinder, selected: boolean) {
        const isCheckboxSelected = await checkboxElement.isSelected();
        if (selected !== isCheckboxSelected) {
            await checkboxElement.click();
        }
    }

    async typeValue(htmlElement: ElementFinder, value: any): Promise<void> {
        await htmlElement.clear();
        await browser.wait(ExpectedConditions.elementToBeClickable(htmlElement));
        await htmlElement.sendKeys(value);
    }

    async typeDate(dateInput: ElementFinder, date: string): Promise<void> {
        Logger.log(`Inputting date into: ${dateInput.locator()} with value: ${JSON.stringify(date)}`);
        Logger.log(`Clicking date input control`);
        await dateInput.click();
        await dateInput.clear();
        Logger.log(`Sending keys: ${date}`);
        return await dateInput.sendKeys(date);
    }

    async selectValueFromSingleSelectOption(selectOptionLocator: ElementFinder, textToSelect: string) {
        await this.browserWaitElementClickable(selectOptionLocator);
        Logger.log(`Clicking: ${selectOptionLocator.locator()}`);
        await selectOptionLocator.click();
        await this.browserWaitElementClickable(element(by.cssContainingText('mat-option > span.mat-option-text', textToSelect)));
        Logger.log(`Clicking element containing text: ${textToSelect}`);
        await element(by.cssContainingText('mat-option > span.mat-option-text', textToSelect))
            .click();
        await browser.waitForAngular();
    }

    async selectValueFromMultipleSelectOption(selectOptionLocator: ElementFinder, textToSelect: string, loseFocusLocator: ElementFinder) {
        await browser.wait(
            ExpectedConditions.elementToBeClickable(selectOptionLocator),
            Wait.normal,
            `Select option element is not clickable: ${selectOptionLocator}`
        );
        await selectOptionLocator.click();
        const option = element(by.cssContainingText('mat-option > span.mat-option-text', textToSelect));
        await browser.wait(ExpectedConditions.elementToBeClickable(option),
            Wait.normal, `Element with text: ${textToSelect} is not visible`);
        await option.click();
        // dismiss popover with options
        await browser.wait(ExpectedConditions.elementToBeClickable(loseFocusLocator),
            Wait.normal, `Element to lose focus is not clickable`);
        return await loseFocusLocator.click();
    }

    async elementThatContains(elements: ElementArrayFinder, ...values: string[]): Promise<ElementFinder> {
        return await elements
            .filter(el => {
                const helper = this;
                return new wdpromise.Promise(async function (resolve) {
                    resolve(await helper.doesElementContainAllValues(el, ...values));
                });
            })
            .first();
    }

    async doesElementContainAllValues(elementToCheck: ElementFinder, ...values: string[]): Promise<boolean> {
        return await elementToCheck
            .getText().then(text => {
                // element text containsAllValues
                return values.reduce(
                    (previous, current) => {
                        return text.indexOf(current) !== -1 && previous;
                    },
                    true
                );
            });
    }

    async browserWaitElementClickable(selectOptionLocator: ElementFinder) {
        Logger.log(`Waiting for element of locator: ${selectOptionLocator.locator()} to be clickable`);
        return await browser.wait(
            ExpectedConditions.elementToBeClickable(selectOptionLocator),
            Wait.normal,
            `Element is not clickable: ${selectOptionLocator}`
        )
    }

    async browserWaitElementVisible(selectOptionLocator: ElementFinder) {
        Logger.log(`Waiting for element of locator: ${selectOptionLocator.locator()} to be visible`);
        return await browser.wait(
            ExpectedConditions.visibilityOf(selectOptionLocator),
            Wait.normal,
            `Element is not visible: ${selectOptionLocator}`
        )
    }
}
