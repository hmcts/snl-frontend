import { TopMenu } from '../pages/top-menu.po';
import { CalendarPage } from '../pages/calendar.po';

export class NavigationFlow {
    topMenu = new TopMenu()

    goToCalendarPage() {
        this.topMenu.openCalendarPage()
        // Due some reasons events in calendar aren't displayed until some action will be taken
        // workaround for it is to select already selected view mode (month/week/day/list)
       new CalendarPage().quickWaitToRenderEvents()
    }

    goToCreateSessionPage() {
        this.topMenu.openSessionCreatePage()
    }

    goToCreateNewListingPage() {
        this.topMenu.openNewListingCreationPage()
    }

    goToSessionSearchPage() {
        this.topMenu.openSessionSearchPage()
    }
}
