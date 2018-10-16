import { element, by } from 'protractor';
import { ElementHelper } from '../utils/element-helper';
import { SessionAmendForm } from '../models/session-amend-form';
import { Logger } from '../utils/logger';
import { forEachSeries } from 'p-iteration';

export class SessionAmendDialog {
    private startTimeInput = element(by.id('startTime'));
    private durationInput = element(by.id('duration'));
    private selectSessionTypeSelectOption = element(by.id('selectAmendSessionType'));
    private noteInput = element(by.css('#new-note textarea'));
    private oldNotesTextAreas = element.all(by.css('#old-notes textarea'));
    private createButton = element(by.id('amend'));
    private elementHelper = new ElementHelper();

    async amendSession(form: SessionAmendForm) {
        await this.elementHelper.typeDate(this.startTimeInput, form.startTime);
        await this.elementHelper.typeValue(this.durationInput, form.durationInMinutes);
        await this.elementHelper.selectValueFromSingleSelectOption(this.selectSessionTypeSelectOption, form.sessionTypeCode);
        await this.elementHelper.typeValue(this.noteInput, form.note);
        Logger.log(`Clicking 'Amend' button by selector: ${this.createButton.locator()}`)
        await this.createButton.click();
    }

    async getNotes() {
        const notes: String[ ] = [];

        await forEachSeries(await this.oldNotesTextAreas.getWebElements(), async (textArea) => {
            notes.push(await textArea.getAttribute('value'))
        })

        Logger.log('Displayed notes: ' + JSON.stringify(notes))

        return notes
    }
}
