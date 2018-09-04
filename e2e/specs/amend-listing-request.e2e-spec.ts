import { LoginFlow } from './../flows/login.flow';
import { NavigationFlow } from './../flows/navigation.flow';
import { CaseTypes } from '../enums/case-types';
import { SessionSearchPage } from '../pages/session-search.po';
import { v4 as uuid } from 'uuid';
import { HearingParts } from '../enums/hearing-parts';
import { ListingCreationPage } from '../pages/listing-creation.po';
import * as moment from 'moment';
import { ListingCreationForm } from '../models/listing-creation-form';
import { TransactionDialogPage } from '../pages/transaction-dialog.po';
import { API }from '../utils/api';

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
const priority = 'Low'
const id = uuid();
const userTransactionId = uuid();
const hearingType = HearingParts.TRIAL;
const otherHearingType = HearingParts.PRELIMINARY;

const displayedListingRequestData = {
  caseNumber,
  caseTitle,
  caseType,
  hearingType,
};

const listingRequest = {
  id,
  duration,
  userTransactionId,
  priority, // move priority to displayedListingRequestData when bug with displaying priority will be fixed
  ...displayedListingRequestData
};

describe('Amend Listing Request', () => {
  beforeAll(async () => {
  await loginFlow.loginIfNeeded()
  });
  describe('Create Listing Request via API', () => {
    it('should create listing request', async () => {
      const statusCode = await API.createListingRequest(listingRequest)
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
        duration: otherDuration,
        fromDate: todayDate,
        endDate: tomorrowDate
      }
      await listingCreationPage.createListingRequest(listingForm)
      await transactionDialogPage.clickAcceptButton();
      const isListingRequestDisplayed = await sessionSearchPage.isListingRequestDisplayed(...Object.values(listingForm));
      expect(isListingRequestDisplayed).toBeTruthy()
    });
  });
});