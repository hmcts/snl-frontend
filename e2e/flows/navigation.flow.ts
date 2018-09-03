import { TopMenu } from '../pages/top-menu.po';
import { CalendarPage } from '../pages/calendar.po';

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
}
