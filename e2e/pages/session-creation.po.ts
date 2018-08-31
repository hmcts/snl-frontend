import { Judges } from '../enums/judges';
import { Rooms } from '../enums/rooms';
import { element, by, ExpectedConditions, browser } from 'protractor';
import { CaseTypes } from '../enums/case-types';
import { ElementHelper } from '../utils/element-helper';
import { Wait } from '../enums/wait';

export class SessionCreationPage {
  private startDateInput = element(by.id('startDate'));
  private startTimeInput = element(by.id('startTime'));
  private durationInput = element(by.id('duration'));
  private selectCaseTypeSelectOption = element(by.id('selectCaseType'));
  private selectRoomSelectOption = element(by.id('selectRoom'));
  private selectJudgeSelectOption = element(by.id('selectJudge'));
  private createButton = element(by.id('create'));
  private elementHelper = new ElementHelper();

  async createSession(startDate: string, startTime: string, duration: number, caseType: CaseTypes, room: Rooms, judge: Judges) {
    await this.elementHelper.typeDate(this.startDateInput, startDate);
    await this.elementHelper.typeDate(this.startTimeInput, startTime);
    await this.elementHelper.typeValue(this.durationInput, duration);
    await this.elementHelper.selectValueFromSingleSelectOption(this.selectCaseTypeSelectOption, caseType);
    await this.elementHelper.selectValueFromSingleSelectOption(this.selectRoomSelectOption, room);
    await this.elementHelper.selectValueFromSingleSelectOption(this.selectJudgeSelectOption, judge);
    await this.createButton.click();
  }

  async waitUntilVisible() {
    await browser.wait(ExpectedConditions.visibilityOf(this.startDateInput), Wait.normal)
  }
}
