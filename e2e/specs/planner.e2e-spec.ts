import { LoginFlow } from '../flows/login.flow';
import { NavigationFlow } from '../flows/navigation.flow';
import * as moment from 'moment';
import { API } from '../utils/api';
import { SessionCreate } from '../../src/app/sessions/models/session-create.model';
import { v4 as uuid } from 'uuid';
import { PlannerPage } from '../pages/planner.po';
import { DateTimeHelper } from '../utils/date-time-helper';
import { Judges, JudgesCodes } from '../enums/judges';
import { RoomCodes, Rooms } from '../enums/rooms';
import { SessionTypes, SessionTypesCodes } from '../enums/session-types';
import { Logger } from '../utils/logger';
import { ElementFinder } from 'protractor';
import { SessionDetailsDialogPage } from '../pages/session-details-dialog.po';

const loginFlow = new LoginFlow();
const navigationFlow = new NavigationFlow();
const plannerPage = new PlannerPage();
const sessionDetailsDialog = new SessionDetailsDialogPage();
let today = moment();
let numberOfVisibleEvents: number;
let visibleElementsDiff: number;
let resourceId: string;
let textToCheck: string;
let sessionsToCreate: SessionCreate[];

async function clickAndValidateDialog(event: ElementFinder, valuesToCheck: string[]) {
    await plannerPage.clickOnEvent(event, valuesToCheck);
    const idDialogDisplayed = await sessionDetailsDialog.isDialogWithTextsDisplayed(...valuesToCheck);
    expect(idDialogDisplayed).toBeTruthy();
    await sessionDetailsDialog.close();
}

describe('Planner, check newly created sessions existence', () => {

    beforeAll(async () => {
        await loginFlow.relogin();
        await navigationFlow.gotoPlannerPage();
        await plannerPage.clickJudgeViewButton();
        await plannerPage.openDayView();
        await plannerPage.clickTodayButton();

        today = DateTimeHelper.generateRandomTimeDuringWorkHours(moment());
        sessionsToCreate = [{
            id: uuid(),
            userTransactionId: uuid(),
            personId: null,
            roomId: null,
            duration: 3600,
            start: today,
            sessionTypeCode: SessionTypesCodes[SessionTypes.FTRACK_TRIAL_ONLY]
        },
            {
                id: uuid(),
                userTransactionId: uuid(),
                personId: JudgesCodes[Judges.AMY_WESSOME],
                roomId: null,
                duration: 3600,
                start: today,
                sessionTypeCode: SessionTypesCodes[SessionTypes.FTRACK_TRIAL_ONLY]
            },
            {
                id: uuid(),
                userTransactionId: uuid(),
                personId: JudgesCodes[Judges.AMY_WESSOME],
                roomId: RoomCodes[Rooms.COURT_4],
                duration: 3600,
                start: today.clone().minute(15),
                sessionTypeCode: SessionTypesCodes[SessionTypes.FTRACK_TRIAL_ONLY]
            }, {
                id: uuid(),
                userTransactionId: uuid(),
                personId: JudgesCodes[Judges.JUDGE_LINDA],
                roomId: null,
                duration: 3600,
                start: today.clone().minute(15),
                sessionTypeCode: SessionTypesCodes[SessionTypes.FTRACK_TRIAL_ONLY]
            }
        ];
    });

    describe('Check if newly created sessions are on planner ', () => {
        it('Create sessions ', async () => {
            numberOfVisibleEvents = await plannerPage.getNumberOfVisibleEvents();
            expect(numberOfVisibleEvents).not.toEqual(0);
            for (let session of sessionsToCreate) {
                expect(await API.createSession(session)).toEqual(200);
                Logger.log('Created session: id: ' + session.id + ' start: ' + session.start.toISOString());
            }
        });

        it('Refresh the view ', async () => {
            await plannerPage.clickNextButton();
            await plannerPage.clickPrevButton();
        });

        it('Refreshed view should show new sessions ', async () => {
            let newNumberOfVisibleEvents = await plannerPage.getNumberOfVisibleEvents();
            visibleElementsDiff = Math.abs(newNumberOfVisibleEvents - numberOfVisibleEvents);
            Logger.log('Sessions number, before call: ' +
                numberOfVisibleEvents + ' after: ' + newNumberOfVisibleEvents +
                ' diff: ' + visibleElementsDiff);

            expect(visibleElementsDiff).toEqual(sessionsToCreate.length);
        });

        it('There should be at least one not allocated Session', async () => {
            plannerPage.waitUntilVisible();
            resourceId = await plannerPage.getResourceIdByName('Not allocated');
            Logger.log('"Not allocated" resource id: ' + resourceId);

            textToCheck = 'No Room - No Judge - ' + SessionTypes.FTRACK_TRIAL_ONLY;
            let found = await plannerPage.getSessionEventTextById(sessionsToCreate[0].id);

            expect(found).toEqual(textToCheck);
        });

        it('after a click open properly filled dialog', async () => {
            let event = await plannerPage.getSessionEventById(sessionsToCreate[0].id);
            const valuesToCheck: string[] = [
                today.format('DD/MM/YYYY'),
                SessionTypes.FTRACK_TRIAL_ONLY,
                '(No judge)',
                '(No room)'
            ];
            await clickAndValidateDialog(event, valuesToCheck);
        });

        it('There should be at least one Session allocated to First judge', async () => {
            resourceId = await plannerPage.getResourceIdByName(Judges.JUDGE_LINDA);
            Logger.log('First judge resource id: ' + resourceId);

            let rowEvents = plannerPage.getAllEventsForTheResource(resourceId);
            rowEvents.first().getText().then(text => {
                Logger.log('row events text: ' + text);
            });

            textToCheck = 'No Room - ' + Judges.JUDGE_LINDA + ' - ' + SessionTypes.FTRACK_TRIAL_ONLY;
            let found = await plannerPage.getSessionEventTextById(sessionsToCreate[3].id);
            expect(found).toEqual(textToCheck);
        });

        it('after a click open properly filled dialog', async () => {
            let event = await plannerPage.getSessionEventById(sessionsToCreate[3].id);
            const valuesToCheck: string[] = [
                today.format('DD/MM/YYYY'),
                SessionTypes.FTRACK_TRIAL_ONLY,
                Judges.JUDGE_LINDA,
                '(No room)'
            ];
            await clickAndValidateDialog(event, valuesToCheck);
        });

        it('There should be at least two Session allocated to Second judge - prepare', async () => {
            resourceId = await plannerPage.getResourceIdByName(Judges.AMY_WESSOME);
            Logger.log('First judge resource id: ' + resourceId);

            const rowEvents = plannerPage.getAllEventsForTheResource(resourceId);
            const foundedEvents = rowEvents.clone().count();
            expect(foundedEvents).toBeGreaterThanOrEqual(2);
        });

        it('check first session', async () => {
            textToCheck = 'No Room - ' + Judges.AMY_WESSOME + ' - ' + SessionTypes.FTRACK_TRIAL_ONLY;
            let found = await plannerPage.getSessionEventTextById(sessionsToCreate[1].id);
            expect(found).toEqual(textToCheck);

            let event = await plannerPage.getSessionEventById(sessionsToCreate[1].id);
            const valuesToCheck: string[] = [
                today.format('DD/MM/YYYY'),
                SessionTypes.FTRACK_TRIAL_ONLY,
                Judges.AMY_WESSOME,
                '(No room)'
            ];
            await clickAndValidateDialog(event, valuesToCheck);
        });

        it('check second session', async () => {
            let secondTextToCheck = Rooms.COURT_4 + ' - ' + Judges.AMY_WESSOME + ' - ' + SessionTypes.FTRACK_TRIAL_ONLY;
            let found = await plannerPage.getSessionEventTextById(sessionsToCreate[2].id);
            expect(found).toEqual(secondTextToCheck);

            let event = await plannerPage.getSessionEventById(sessionsToCreate[2].id);
            const valuesToCheck: string[] = [
                today.format('DD/MM/YYYY'),
                SessionTypes.FTRACK_TRIAL_ONLY,
                Judges.AMY_WESSOME,
                Rooms.COURT_4
            ];
            await clickAndValidateDialog(event, valuesToCheck);
        });
    });

});
