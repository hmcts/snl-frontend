import { TopMenu } from '../pages/top-menu.po';
import { CalendarPage } from '../pages/calendar.po';
import { Logger } from '../utils/logger';

export class NavigationFlow {
  topMenu = new TopMenu();

  async goToCalendarPage() {
    await this.topMenu.openCalendarPage();
    await new CalendarPage().openListView();
  }

  async goToNewSessionPage() {
    await this.topMenu.openNewSessionPage();
  }

  async goToNewListingRequestPage() {
    await this.topMenu.openNewListingRequestPage();
  }

  async goToListHearingsPage() {
    await this.topMenu.openListHearingPage();
  }

  async goToAmendSessionsListPage() {
    await this.topMenu.openSessionsAmendListPage();
  }

  async goToProblemsPage() {
    Logger.log(`Opening problems page`);
    await this.topMenu.openProblemsPage();
  }

  async gotoPlannerPage() {
      await this.topMenu.openPlannerPage();
  }

  async gotoSearchListingRequestPage() {
    await this.topMenu.openSearchListingRequestPage();
  }
}
