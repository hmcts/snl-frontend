import { TopMenu } from '../pages/top-menu.po';
import { element, by } from '../../node_modules/protractor';

export class NavigationFlow {
    topMenu = new TopMenu()

    goToCalendarPage() {
        this.topMenu.openCalendarPage()
        // Due some reasons events in calendar aren't displayed until some action will be taken
        // workaround for it is to select already selected view mode (month/week/day/list)
        element.all((by.className('fc-state-active'))).first().click()
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
