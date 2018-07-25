import { TopMenu } from '../pages/top-menu.po';
import { CalendarPage } from '../pages/calendar.po';

export class NavigationFlow {
  topMenu = new TopMenu();

  goToCalendarPage() {
    this.topMenu.openCalendarPage();
    new CalendarPage().openListView();
  }

  goToCreateSessionPage() {
    this.topMenu.openSessionCreatePage();
  }

  goToCreateNewListingPage() {
    this.topMenu.openNewListingCreationPage();
  }

  goToSessionSearchPage() {
    this.topMenu.openSessionSearchPage();
  }
}
