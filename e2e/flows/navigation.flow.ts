import { TopMenu } from '../pages/top-menu.po';
import { CalendarPage } from '../pages/calendar.po';

export class NavigationFlow {
  topMenu = new TopMenu();

  goToCalendarPage() {
    this.topMenu.openCalendarPage();
    new CalendarPage().openListView();
  }

  goToNewSessionPage() {
    this.topMenu.openNewSessionPage();
  }

  goToNewListingRequestPage() {
    this.topMenu.openNewListingRequestPage();
  }

  goToListHearingsPage() {
    this.topMenu.openListHearingPage();
  }
}
