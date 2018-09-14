import { element, by } from 'protractor';
import { ElementHelper } from '../utils/element-helper';
import { SessionAmendForm } from '../models/session-amend-form';

export class SessionAmendDialog {
    private startTimeInput = element(by.id('startTime'));
    private durationInput = element(by.id('duration'));
    private selectSessionTypeSelectOption = element(by.id('selectAmendSessionType'));
    private createButton = element(by.id('create'));
    private elementHelper = new ElementHelper();

    async amendSession(form: SessionAmendForm) {
        await this.elementHelper.typeDate(this.startTimeInput, form.startTime);
        await this.elementHelper.typeValue(this.durationInput, form.durationInMinutes);
        await this.elementHelper.selectValueFromSingleSelectOption(this.selectSessionTypeSelectOption, form.sessionTypeCode);
        await this.createButton.click();
    }
}
