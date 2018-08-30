import { ListingCreationForm } from './../models/listing-creation-form';
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
import { HearingParts } from '../enums/hearing-parts';
import { SessionSearchPage } from '../pages/session-search.po';
import { SessionDetailsDialogPage } from '../pages/session-details-dialog.po';
import { FilterSessionsComponentForm } from '../models/filter-sessions-component-form';
import { SnackBar } from '../components/snack-bar';
import { browser } from 'protractor';

const now = moment()
const todayDate = now.format('DD/MM/YYYY')
const tomorrowDate = now.add(1, 'day').format('DD/MM/YYYY')
const startTime = now.format('HH:mm')
const startTimeAMFormat = now.format('h:mm')
const duration = 15
const sessionCaseType = CaseTypes.FTRACK
const room = Rooms.ROOM_B
const judge = Judges.JOHN_HARRIS
const caseNumber = now.format('HH:mm DD.MM')
const caseTitle = 'e2e Test'
const listingRequestCaseType = CaseTypes.MTRACK // must be other than sessionCaseType
const hearingType = HearingParts.ADJOURNED
const caseTypeProblemText = 'Hearing case type does not match the session case type - Warn'

const listingCreationForm: ListingCreationForm = {
  caseNumber,
    caseTitle,
    caseType: listingRequestCaseType,
    hearingType: hearingType,
    duration: duration,
    fromDate: todayDate,
    endDate: tomorrowDate
}
const formValues: FilterSessionsComponentForm = {
    startDate: todayDate,
    endDate: tomorrowDate,
    caseType: sessionCaseType,
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
  beforeAll(() => {
    loginFlow.loginIfNeeded();
    navigationFlow.goToCalendarPage()
  });
  describe('Remember number of visible events in calendar, Go to new session page and create session', () => {
    it('Transaction dialog should be displayed ', async () => {
      numberOfVisibleEvents = await calendarPage.getNumberOfVisibleEvents()
      navigationFlow.goToNewSessionPage()
      sessionCreationPage.createSession(todayDate, startTime, duration, sessionCaseType, room, judge)
      expect(transactionDialogPage.isSessionCreationSummaryDisplayed()).toBeTruthy()
      transactionDialogPage.clickAcceptButton()
    });
  });
  describe('Go back to calendar page ', () => {
    it('newly created session should be visible', async () => {
      navigationFlow.goToCalendarPage();
      const numberOfVisibleEventsAfterSessionCreation = await calendarPage.getNumberOfVisibleEvents()
      expect(numberOfVisibleEvents + 1).toEqual(numberOfVisibleEventsAfterSessionCreation)
    });
  });
  describe('Go to  new listing request page, create listing with different case type', () => {
    it('newly created session should be visible', async () => {
      navigationFlow.goToNewListingRequestPage()
      listingCreationPage.createListingRequest(listingCreationForm)
      expect(transactionDialogPage.isSessionCreationSummaryDisplayed()).toBeTruthy()
      transactionDialogPage.clickAcceptButton();
    });
  });
  describe('Go to list hearing page, find and select created session and listing', () => {
    it('assign button should be enabled', async () => {
      navigationFlow.goToListHearingsPage();
      sessionSearchPage.filterSession(formValues);
      sessionSearchPage.changeMaxItemsPerPage('100');
      sessionSearchPage.selectSession(judge, todayDate, startTime, room, sessionCaseType);
      sessionSearchPage.selectListingRequest(caseNumber, caseTitle, listingRequestCaseType, todayDate, tomorrowDate);
      expect(sessionSearchPage.assignButton.isEnabled()).toEqual(true);
    });
  });
  describe('Click on "assign" button,', () => {
    it('transaction dialog with problem that case types are different should be displayed', async () => {
      sessionSearchPage.assignButton.click()
      const isCaseTypeProblemDisplayed = await transactionDialogPage.isProblemWithTextDisplayed(caseTypeProblemText)
      expect(isCaseTypeProblemDisplayed).toBeTruthy()
      transactionDialogPage.clickAcceptButton();
    });
  });
  describe('Go to calendar, click on created session', () => {
    it('despite problem it should assign listing request to session and display its details', async () => {
      navigationFlow.goToCalendarPage()
      browser.waitForAngular();
      calendarPage.clickOnEventWith(startTimeAMFormat)
        expect(sessionDetailsDialogPage
        .isDialogWithTextsDisplayed(sessionCaseType, judge, room, todayDate, startTime, caseTitle, hearingType))
      .toBeTruthy()
      sessionDetailsDialogPage.close()
    });
  });
});
