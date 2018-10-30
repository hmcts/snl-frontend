import { ListingCreationForm } from '../models/listing-creation-form';
import { TransactionDialogPage } from '../pages/transaction-dialog.po';
import { SessionCreationPage } from '../pages/session-creation.po';
import { LoginFlow } from '../flows/login.flow';
import { NavigationFlow } from '../flows/navigation.flow';
import * as moment from 'moment'
import { CaseTypes } from '../enums/case-types';
import { Rooms } from '../enums/rooms';
import { Judges } from '../enums/judges';
import { CalendarPage } from '../pages/calendar.po';
import { ListingCreationPage } from '../pages/listing-creation.po';
import { HearingTypes } from '../enums/hearing-types';
import { SessionSearchPage } from '../pages/session-search.po';
import { SessionDetailsDialogPage } from '../pages/session-details-dialog.po';
import { FilterSessionsComponentForm } from '../models/filter-sessions-component-form';
import { browser } from 'protractor';
import { SessionTypes } from '../enums/session-types';

const now = moment()
const todayDate = now.format('DD/MM/YYYY')
const tomorrowDate = now.add(1, 'day').format('DD/MM/YYYY')
const startTime = now.format('HH:mm')
const startTimeAMFormat = now.format('h:mm')
const duration = 15
const sessionType = SessionTypes.K_FAST_TRACK_AND_APPLICATIONS
const room = Rooms.COURT_4
const judge = Judges.JUDGE_LINDA
const caseNumber = now.format('HH:mm DD.MM')
const caseTitle = 'e2e Test'
const assignListingStartTime = now.add('1', 'hours').format('HH:mm')
const listingRequestCaseType = CaseTypes.K_SMALL_CLAIMS // must be other than sessionCaseType
const listingRequestHearingType = HearingTypes.K_ASAJ;
const caseTypesInvalidMsg = 'Session of type ' + sessionType + ' is not suitable for this listing request'

const listingCreationForm: ListingCreationForm = {
    caseNumber,
    caseTitle,
    caseType: listingRequestCaseType,
    hearingType: listingRequestHearingType,
    duration: duration,
    fromDate: todayDate,
    endDate: tomorrowDate
}
const formValues: FilterSessionsComponentForm = {
    startDate: todayDate,
    endDate: tomorrowDate,
    sessionType: sessionType,
    room: room,
    judge: judge,
    listingDetailsOptions: {
      unlisted: false,
      partListed: false,
      fullyListed: false,
      overListed: false,
      customListed: {
          checked: false,
          from: 0,
          to: 0,
      }
    }
}

const loginFlow = new LoginFlow()
const navigationFlow = new NavigationFlow()
const sessionCreationPage = new SessionCreationPage()
const calendarPage = new CalendarPage()
const transactionDialogPage = new TransactionDialogPage()
const listingCreationPage = new ListingCreationPage()
const sessionSearchPage = new SessionSearchPage()
const sessionDetailsDialogPage = new SessionDetailsDialogPage()
let numberOfVisibleEvents: number;

describe('Create Session and Listing Request, assign them despite problem, check details into calendar', () => {
  beforeAll(async () => {
    await loginFlow.loginIfNeeded();
    await navigationFlow.goToCalendarPage()
  });
  describe('Remember number of visible events in calendar, Go to new session page and create session', () => {
    it('Transaction dialog should be displayed ', async () => {
      numberOfVisibleEvents = await calendarPage.getNumberOfVisibleEvents()
      await navigationFlow.goToNewSessionPage()
      await sessionCreationPage.createSession(todayDate, startTime, duration, sessionType, room, judge)
      expect(await transactionDialogPage.isActionCreationSummaryDisplayed()).toBeTruthy()
      await transactionDialogPage.clickAcceptButton()
    });
  });
  describe('Go back to calendar page ', () => {
    it('newly created session should be visible', async () => {
      await navigationFlow.goToCalendarPage();
      const numberOfVisibleEventsAfterSessionCreation = await calendarPage.getNumberOfVisibleEvents()
      expect(numberOfVisibleEvents + 1).toEqual(numberOfVisibleEventsAfterSessionCreation)
    });
  });
  describe('Go to new listing request page, create listing with different case type', () => {
    it('newly created listing request should be visible', async () => {
      await navigationFlow.goToNewListingRequestPage()
      await listingCreationPage.createListingRequest(listingCreationForm)
      expect(await transactionDialogPage.isActionCreationSummaryDisplayed()).toBeTruthy()
      await transactionDialogPage.clickAcceptButton();
    });
  });
  describe('Go to list hearing page, find and select created session and listing', () => {
    it('assign button should be enabled', async () => {
      await navigationFlow.goToListHearingsPage();
      await sessionSearchPage.filterSession(formValues);
      await sessionSearchPage.changeMaxItemsPerPage('100');
      await sessionSearchPage.selectSession(judge, todayDate, startTime, room, sessionType);
      await sessionSearchPage.selectListingRequest(caseNumber, caseTitle, listingRequestCaseType,
        listingRequestHearingType, todayDate, tomorrowDate);
      expect(await sessionSearchPage.assignButton.isEnabled()).toEqual(true);
    });
  });
  describe('Click on "assign" button,', () => {
    it('transaction dialog with problem that case types are different should be displayed', async () => {
      await sessionSearchPage.clickAssignButton();
      await sessionSearchPage.acceptAssignWithCurrentTime(assignListingStartTime);
      const isCaseTypeProblemDisplayed = await transactionDialogPage.isProblemWithTextDisplayed(caseTypesInvalidMsg)
      expect(isCaseTypeProblemDisplayed).toBeTruthy()
      await transactionDialogPage.clickAcceptButton();
    });
  });
  describe('Go to calendar, click on created session', () => {
    it('despite problem it should assign listing request to session and display its details', async () => {
      await navigationFlow.goToCalendarPage()
      await browser.waitForAngular();
      await calendarPage.clickOnEventWith(startTimeAMFormat)
      const isDialogDisplayed = await sessionDetailsDialogPage.isDialogWithTextsDisplayed(
        sessionType, judge, room, todayDate, startTime, caseTitle, listingRequestHearingType, caseNumber, assignListingStartTime
      );
      expect(isDialogDisplayed).toBeTruthy()
      await sessionDetailsDialogPage.close()
    });
  });
});
