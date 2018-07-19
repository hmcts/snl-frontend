import { Judges } from '../enums/judges';
import { Rooms } from '../enums/rooms';
import { element, by } from 'protractor';
import { CaseTypes } from '../enums/case-types';
import { ElementHelper } from '../utils/element-helper';

export class SessionCreationPage {
    private startDateInput = element(by.id('startDate'))
    private startTimeInput = element(by.id('startTime'))
    private durationInput = element(by.id('duration'))
    private selectCaseTypeSelectOption = element(by.id('selectCaseType'))
    private selectRoomSelectOption = element(by.id('selectRoom'))
    private selectJudgeSelectOption = element(by.id('selectJudge'))
    private createButton = element(by.id('create'))
    private elementHelper = new ElementHelper()

    createSession(startDate: string, startTime: string, duration: number, caseType: CaseTypes, room: Rooms, judge: Judges) {
        this.elementHelper.typeDate(this.startDateInput, startDate)
        this.elementHelper.typeDate(this.startTimeInput, startTime)
        this.elementHelper.typeValue(this.durationInput, duration)
        this.elementHelper.selectValueFromSelectOption(this.selectCaseTypeSelectOption, caseType)
        this.elementHelper.selectValueFromSelectOption(this.selectRoomSelectOption, room)
        this.elementHelper.selectValueFromSelectOption(this.selectJudgeSelectOption, judge)
        this.createButton.click()
    }
}
