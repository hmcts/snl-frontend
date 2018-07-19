import { by, element, browser, ExpectedConditions, promise } from 'protractor';
import { Wait } from '../enums/wait';

export class CalendarPage {
    private calendarEntryClass = by.className('fc-v-event');

    getNumberOfVisibleEvents(): promise.Promise<number> {
        this.quickWaitToRenderEvents()
        return element.all(this.calendarEntryClass).count()
    }

    quickWaitToRenderEvents() {
        // Due some reasons events in calendar aren't displayed until some action will be taked
        // workaround for it is to select already selected view mode (month/week/day/list)
        element.all((by.className('fc-state-active'))).first().click()
        browser
            .wait(ExpectedConditions.visibilityOf(element(this.calendarEntryClass)), Wait.short)
            .catch((() => Promise.resolve(false)))
    }

    clickOnEventWith(startTime: string) {
        element(by.css(`div[data-start="${startTime}"]`)).click()
    }
}
