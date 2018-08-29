import { ElementHelper } from '../utils/element-helper';
import { element, by } from 'protractor';
import { ListingCreationForm } from '../models/listing-creation-form';

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

  createListingRequest(listingCreationForm: ListingCreationForm) {
    this.elementHelper.typeValue(this.caseNumberInput, listingCreationForm.caseNumber);
    this.elementHelper.typeValue(this.caseTitleInput, listingCreationForm.caseTitle);
    this.elementHelper.selectValueFromSelectOption(this.selectCaseTypeSelectOption, listingCreationForm.caseType);
    this.elementHelper.selectValueFromSelectOption(this.selectHearingPartSelectOption, listingCreationForm.hearingType);
    this.elementHelper.typeValue(this.durationInput, listingCreationForm.duration);
    this.elementHelper.typeDate(this.fromDateInput, listingCreationForm.fromDate);
    this.elementHelper.typeDate(this.endDateInput, listingCreationForm.endDate);
    this.saveButton.click();
  }
}
