import { by, element, browser, ExpectedConditions, promise } from 'protractor';
import { Wait } from '../enums/wait';

export class CalendarPage {
    getNumberOfVisibleEvents(): promise.Promise<number> {
        const calendarEntryClass = by.className('fc-v-event');
        // Due some reasons events in calendar aren't displayed until some action will be taked
        // workaround for it is to select already selected view mode (month/week/day/list)
        element.all((by.className('fc-state-active'))).first().click()
        browser
            .wait(ExpectedConditions.visibilityOf(element(calendarEntryClass)), Wait.short)
            .catch((() => Promise.resolve(false)))

        return element.all(calendarEntryClass).count()
    }

    clickOnEventWith(startTime: string) {
        element(by.css(`div[data-start="${startTime}"]`)).click()
    }
}
