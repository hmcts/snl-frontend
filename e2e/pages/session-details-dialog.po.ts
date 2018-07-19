import { ElementHelper } from '../utils/element-helper';
import { by, element, browser, ExpectedConditions, promise } from 'protractor';
import { Wait } from '../enums/wait';

export class SessionDetailsDialogPage {
    private elementHelper = new ElementHelper()

    async getNumberOfVisibleEvents(): Promise<number> {
        // Due some reasons events in calendar aren't displayed until some action will be taked
        // workaround for it is to select already selected view mode (month/week/day/list)
        element((by.className('fc-state-active'))).first().click()

        const calendarEntryClass = by.className('fc-v-event');
        browser
            .wait(ExpectedConditions.visibilityOf(element(calendarEntryClass)), Wait.short)
            .catch((() => Promise.resolve(false)))

        return element.all(calendarEntryClass).count()
    }

    isDialogWithTextsDisplayed(...text: string[]): promise.Promise<boolean> {
        const eventsWrapper = element.all(by.css('app-details-dialog'))
        return this.elementHelper.elementThatContains(eventsWrapper, ...text).isDisplayed()
    }

    close() {
        element(by.id('close')).click()
    }
}
