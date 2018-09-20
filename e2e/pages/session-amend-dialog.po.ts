import { element, by } from 'protractor';
import { ElementHelper } from '../utils/element-helper';
import { SessionAmendForm } from '../models/session-amend-form';
import { Logger } from '../utils/logger';

export class SessionAmendDialog {
    private startTimeInput = element(by.id('startTime'));
    private durationInput = element(by.id('duration'));
    private selectSessionTypeSelectOption = element(by.id('selectAmendSessionType'));
    private createButton = element(by.id('amend'));
    private elementHelper = new ElementHelper();

    async amendSession(form: SessionAmendForm) {
        await this.elementHelper.typeDate(this.startTimeInput, form.startTime);
        await this.elementHelper.typeValue(this.durationInput, form.durationInMinutes);
        await this.elementHelper.selectValueFromSingleSelectOption(this.selectSessionTypeSelectOption, form.sessionTypeCode);
        Logger.log(`Clicking 'Amend' button by selector: ${this.createButton.locator()}`)
        await this.createButton.click();
    }
}
