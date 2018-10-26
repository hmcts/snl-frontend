import { LoginFlow } from '../flows/login.flow';
import { NavigationFlow } from '../flows/navigation.flow';
import { CaseTypes } from '../enums/case-types';
import { SessionSearchPage } from '../pages/session-search.po';
import { v4 as uuid } from 'uuid';
import { HearingTypes } from '../enums/hearing-types';
import { LISTING_NOTES, ListingCreationPage } from '../pages/listing-creation.po';
import * as moment from 'moment';
import { ListingCreationForm } from '../models/listing-creation-form';
import { TransactionDialogPage } from '../pages/transaction-dialog.po';
import { API }from '../utils/api';
import { CreateListingRequestBody } from '../models/create-listing-request-body';

const now = moment()
const todayDate = now.format('DD/MM/YYYY')
const tomorrowDate = now.add(1, 'day').format('DD/MM/YYYY')

const loginFlow: LoginFlow = new LoginFlow();
const navigationFlow: NavigationFlow = new NavigationFlow();
const sessionSearchPage = new SessionSearchPage();
const listingCreationPage = new ListingCreationPage();
const transactionDialogPage = new TransactionDialogPage()

const caseNumber = `number-${new Date().toLocaleString()}`
const caseTitle = `title-${new Date().toLocaleString()}`
const caseType: string = CaseTypes.SCLAIMS;
const otherCaseType = CaseTypes.FTRACK;
const duration = 'PT30M';
const otherDuration = 45;
const priority = 'Low';
const id = uuid();
const userTransactionId = uuid();
const hearingType = HearingTypes.TRIAL;
const otherHearingType = HearingTypes.ADJOURNED;
const specReqNoteValue = 'SPEC REQ';

const displayedListingRequestData = {
  caseNumber,
  caseTitle,
  caseType,
  hearingType,
  priority
};

const listingRequestCreate: CreateListingRequestBody = {
    id, caseNumber, caseTitle, priority, duration, userTransactionId, caseTypeCode: 'small-claims',  hearingTypeCode: 'trial',
    numberOfSessions: 1
};

describe('Amend Listing Request', () => {
  beforeAll(async () => {
    await loginFlow.loginIfNeeded()
  });
  describe('Create Listing Request via API', () => {
    it('should create listing request', async () => {
      const statusCode = await API.createListingRequest(listingRequestCreate)
      expect(statusCode).toEqual(200);
    });
  });
  describe('Go to listing hearings page', () => {
    it('created listing request should be visible on list', async () => {
      await navigationFlow.goToListHearingsPage();
      await sessionSearchPage.changeMaxItemsPerPage('100');
      const isListingRequestDisplayed = await sessionSearchPage.isListingRequestDisplayed(...Object.values(displayedListingRequestData));
      expect(isListingRequestDisplayed).toBeTruthy();
    });
  });
  describe('Click on edit and change some values', () => {
    it('new values should be visible on list', async () => {
      await sessionSearchPage.editListingRequestWithValues(caseNumber);
      const newCaseNumber = `edited-${caseNumber}`;
      const newCaseTitle = `edited-${caseTitle}`;
      const listingForm: ListingCreationForm = {
        caseNumber: newCaseNumber,
        caseTitle: newCaseTitle,
        caseType: otherCaseType,
        hearingType: otherHearingType,
        durationMinutes: otherDuration,
        durationDays: null,
        numberOfSessions: 1,
        fromDate: todayDate,
        endDate: tomorrowDate
      };
      await listingCreationPage.setNoteValue(LISTING_NOTES.SPECIAL_REQUIREMENTS, specReqNoteValue);
      await listingCreationPage.createListingRequest(listingForm);
      await transactionDialogPage.clickAcceptButton();
      const isListingRequestDisplayed = await sessionSearchPage.isListingRequestDisplayed(
          newCaseNumber, newCaseTitle, otherCaseType, otherHearingType, otherDuration.toString(), todayDate, tomorrowDate);
      expect(isListingRequestDisplayed).toBeTruthy()
    });
  });
  describe('Click on notes indicator and verify the notes', () => {
      it('notes should be present', async () => {
          let notePresent = await sessionSearchPage.checkIfHasNote(
              LISTING_NOTES.SPECIAL_REQUIREMENTS.selector,
              specReqNoteValue, caseNumber
          );
          expect(notePresent).toBeTruthy(`Expected note DOES NOT have text: ${specReqNoteValue}`);
      });
  });
});
