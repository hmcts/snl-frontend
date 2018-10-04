import { LoginFlow } from '../flows/login.flow';
import { NavigationFlow } from '../flows/navigation.flow';
import { CaseTypes } from '../enums/case-types';
import { HearingTypes } from '../enums/hearing-types';
import { ListingCreationPage } from '../pages/listing-creation.po';
import * as moment from 'moment';
import { ListingCreationForm } from '../models/listing-creation-form';
import { TransactionDialogPage } from '../pages/transaction-dialog.po';
import { API }from '../utils/api';
import { waitFor } from '../utils/wait-for';
import { Wait } from '../enums/wait';

const loginFlow: LoginFlow = new LoginFlow();
const navigationFlow: NavigationFlow = new NavigationFlow();
const listingCreationPage = new ListingCreationPage();
const transactionDialogPage = new TransactionDialogPage()
let numberOfHearingParts: number;

const todayDate = moment().format('DD/MM/YYYY')
const tomorrowString = moment().add(1, 'day').format('DD/MM/YYYY')
const formValues: ListingCreationForm = {
  caseNumber: 'e2e case number' + moment().toISOString(),
  caseTitle: 'e2e case title' + moment().toISOString(),
  caseType: CaseTypes.FTRACK,
  hearingType: HearingTypes.TRIAL,
  duration: 60,
  fromDate: tomorrowString,
  endDate: tomorrowString
}

describe('Create Listing Request', () => {
  beforeAll(async () => {
    await loginFlow.loginIfNeeded()
  });
  describe('Get number of hearing parts', () => {
    it('should save count of listing request', async () => {
      numberOfHearingParts = (await API.getHearingParts() as any[]).length
    });
  });
  describe('Go to create hearing page', () => {
    it('created hearing page should be visible', async () => {
      await navigationFlow.goToNewListingRequestPage()
    });
  });
  describe('Fill in a form, set start & end dates for tomorrow', () => {
    it('popup with problems should appear', async () => {
      await listingCreationPage.createListingRequest(formValues)
      const problemText = 'Listing request target schedule to date is 4 weeks or nearer from today and it has not been listed yet - Urgent'
      const isProblemDisplayed = await transactionDialogPage.isProblemWithTextDisplayed(problemText)
      expect(isProblemDisplayed).toBeTruthy()
    });
    it('click rollback, new hearing part should not be created', async () => {
      transactionDialogPage.clickRollbackButton()
      const isHearingPartCreatedWhenRollback = await waitFor(Wait.normal, async () => {
        const numberOfHearingPartsAfterRollback = (await API.getHearingParts() as any[]).length
        return numberOfHearingParts === numberOfHearingPartsAfterRollback
    })

      expect(isHearingPartCreatedWhenRollback).toBeTruthy()
    });
  });
  describe('change start date for today', () => {
    it('click save, problem dialog should not appear', async () => {
      formValues.fromDate = todayDate
      formValues.endDate = todayDate
      await listingCreationPage.createListingRequest(formValues)
      expect(await transactionDialogPage.isActionCreationSummaryDisplayed()).toBeTruthy()
      await transactionDialogPage.clickAcceptButton();
    });
    it('newly created hearing part should be returned from API', async () => {
      const numberOfHearingPartsAfterAccept = (await API.getHearingParts() as any[]).length
      expect(numberOfHearingParts + 1).toEqual(numberOfHearingPartsAfterAccept)
    })
  });
});
