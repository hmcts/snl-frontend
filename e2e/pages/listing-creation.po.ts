import { ElementHelper } from '../utils/element-helper';
import { element, by, browser, ExpectedConditions } from 'protractor';
import { ListingCreationForm } from '../models/listing-creation-form';
import { Wait } from '../enums/wait';
import { Logger } from '../utils/logger';

interface ListingNote {
  selector: string,
  parentList: string
}

export const LISTING_NOTES = {
  SPECIAL_REQUIREMENTS: {
    selector: 'note-SpecialRequirements',
    parentList: 'noteList'
  } as ListingNote,
  FACILITY_REQUIREMENTS: {
    selector: 'note-FacilityRequirements',
    parentList: 'noteList'
  } as ListingNote,
  OTHER_NOTES: {
    selector: 'note-Othernote',
    parentList: 'otherNoteList'
  } as ListingNote
}

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

  async setNoteValue(note: ListingNote, value: string) {
    Logger.log(`Setting note of id: ${note.selector} within list of id ${note.parentList} to have text: \'${value}\'`);
    let noteElement = await this.parentElement.element(by.id(note.parentList)).element(by.id(note.selector));
    let textArea = await noteElement.element(by.id('note-textarea'));
    Logger.log(`Locating textarea of note successful. Typing in the value`);
    await this.elementHelper.typeValue(textArea, value);
  }

  async waitUntilVisible() {
    await browser.wait(ExpectedConditions.visibilityOf(this.parentElement), Wait.normal, `Listing Create page is not visible`)
  }
}
