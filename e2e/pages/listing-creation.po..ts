import { ElementHelper } from './../utils/element-helper';
import { element, by } from 'protractor';
import { ListingCreationForm } from '../models/listing-creation-form';

export class ListingCreationPage {
    private caseNumberInput = element(by.id('caseNumber'))
    private caseTitleInput = element(by.id('caseTitle'))
    private selectCaseTypeSelectOption = element(by.id('selectCaseType'))
    private selectHearingPartSelectOption = element(by.id('selectHearingPart'))
    private durationInput = element(by.id('duration'))
    private fromDateInput = element(by.id('fromDate'))
    private endDateInput = element(by.id('endDate'))
    private saveButton = element(by.id('save'))
    private elementHelper = new ElementHelper()

    createListingRequest(listingCreationForm: ListingCreationForm) {
        this.elementHelper.typeValue(this.caseNumberInput, listingCreationForm.caseNumber)
        this.elementHelper.typeValue(this.caseTitleInput, listingCreationForm.caseTitle)
        this.elementHelper.selectValueFromSelectOption(this.selectCaseTypeSelectOption, listingCreationForm.caseType)
        this.elementHelper.selectValueFromSelectOption(this.selectHearingPartSelectOption, listingCreationForm.hearingType)
        this.elementHelper.typeValue(this.durationInput, listingCreationForm.duration)
        this.elementHelper.typeDate(this.fromDateInput, listingCreationForm.fromDate)
        this.elementHelper.typeDate(this.endDateInput, listingCreationForm.endDate)
        this.saveButton.click()
    }
}
