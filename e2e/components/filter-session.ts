import { ElementHelper } from '../utils/element-helper';
import { by, element, ElementFinder } from 'protractor';
import { FilterSessionsComponentForm } from '../models/filter-sessions-component-form';
import { Logger } from '../utils/logger';

export class FilterSessionComponent {
  private body = element(by.css('body'));
  private startDateInput = element(by.id('startDate'));
  private endDateInput = element(by.id('endDate'));
  private selectSessionTypeSelectOption = element(by.id('selectSessionType'));
  private selectRoomSelectOption = element(by.id('selectRoom'));
  private selectJudgeSelectOption = element(by.id('selectJudge'));
  private unlistedCheckboxInput = element(by.id('unlistedCheckbox-input'));
  private partCheckboxInput = element(by.id('partCheckbox-input'));
  private fullyListedCheckboxCheckboxInput = element(by.id('fullyListedCheckbox-input'));
  private overListedCheckboxCheckboxInput = element(by.id('overListedCheckbox-input'));
  private customCheckboxInput = element(by.id('customCheckbox-input'));
  private customFromInput = element(by.id('customFrom'));
  private customToInput = element(by.id('customTo'));
  private filterButton = element(by.id('filter'));
  private elementHelper = new ElementHelper();

  async filter(formValues: FilterSessionsComponentForm) {
    Logger.log(`Filtering sessions with values: ${JSON.stringify(formValues)}`);
    await this.waitForStartDateInputToBeVisible();

    await this.elementHelper.typeDate(this.startDateInput, formValues.startDate);
    await this.elementHelper.typeDate(this.endDateInput, formValues.endDate);

    const selectOptionPairs: [ElementFinder, string][] = [
      [this.selectSessionTypeSelectOption, formValues.sessionType],
      [this.selectRoomSelectOption, formValues.room],
      [this.selectJudgeSelectOption, formValues.judge],
      [this.selectJudgeSelectOption, formValues.judge]
    ];

    await selectOptionPairs.reduce(async (prom, pair) => {
      await prom;
      return await pair[1] === undefined ?
          Promise.resolve() : this.elementHelper.selectValueFromMultipleSelectOption(pair[0], pair[1], this.body)
    }, Promise.resolve())

    const checkBoxPairs: [ElementFinder, boolean][] = [
      [this.unlistedCheckboxInput, formValues.listingDetailsOptions.unlisted],
      [this.partCheckboxInput, formValues.listingDetailsOptions.partListed],
      [this.fullyListedCheckboxCheckboxInput, formValues.listingDetailsOptions.fullyListed],
      [this.overListedCheckboxCheckboxInput, formValues.listingDetailsOptions.overListed],
      [this.customCheckboxInput, formValues.listingDetailsOptions.customListed.checked]
    ];

    await checkBoxPairs.reduce(async (prom, pair) => {
      await prom;
      return await this.elementHelper.selectCheckbox(pair[0], pair[1])
    }, Promise.resolve());

    if (formValues.listingDetailsOptions.customListed.checked) {
      await this.elementHelper.typeValue(this.customFromInput, formValues.listingDetailsOptions.customListed.from);
      await this.elementHelper.typeValue(this.customToInput, formValues.listingDetailsOptions.customListed.to);
    }

    await this.filterButton.click();
  }

  private async waitForStartDateInputToBeVisible() {
    Logger.log('Waiting for startDateInput to be visible');
    return await this.elementHelper.browserWaitElementVisible(this.startDateInput);
  }
}
