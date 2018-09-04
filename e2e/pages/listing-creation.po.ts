import { ElementHelper } from '../utils/element-helper';
import { element, by, browser, ExpectedConditions } from 'protractor';
import { ListingCreationForm } from '../models/listing-creation-form';
import { Wait } from '../enums/wait';

export class ListingCreationPage {
  private parentElement = element(by.css('app-listing-create'))
  private caseNumberInput = this.parentElement.element(by.id('caseNumber'));
  private caseTitleInput = this.parentElement.element(by.id('caseTitle'));
  private selectCaseTypeSelectOption = this.parentElement.element(by.id('selectCaseType'));
  private selectHearingPartSelectOption = this.parentElement.element(by.id('selectHearingPart'));
  private durationInput = this.parentElement.element(by.id('duration'));
  private fromDateInput = this.parentElement.element(by.id('fromDate'));
  private endDateInput = this.parentElement.element(by.id('endDate'));
  private saveButton = this.parentElement.element(by.id('save'));
  private elementHelper = new ElementHelper();

  async createListingRequest(listingCreationForm: ListingCreationForm): Promise<void> {
    await this.elementHelper.typeValue(this.caseNumberInput, listingCreationForm.caseNumber);
    await this.elementHelper.typeValue(this.caseTitleInput, listingCreationForm.caseTitle);
    await this.elementHelper.selectValueFromSingleSelectOption(this.selectCaseTypeSelectOption, listingCreationForm.caseType);
    await this.elementHelper.selectValueFromSingleSelectOption(this.selectHearingPartSelectOption, listingCreationForm.hearingType);
    await this.elementHelper.typeValue(this.durationInput, listingCreationForm.duration);
    await this.elementHelper.typeDate(this.fromDateInput, listingCreationForm.fromDate);
    await this.elementHelper.typeDate(this.endDateInput, listingCreationForm.endDate);
    return await this.saveButton.click();
  }

  async waitUntilVisible() {
    await browser.wait(ExpectedConditions.visibilityOf(this.parentElement), Wait.normal, `Listing Create page is not visible`)
  }
}
