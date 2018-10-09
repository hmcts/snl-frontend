import { LoginFlow } from '../flows/login.flow';
import { NavigationFlow } from '../flows/navigation.flow';
import * as moment from 'moment';
import { API } from '../utils/api';
import { SessionCreate } from '../../src/app/sessions/models/session-create.model';
import { PlannerPage } from '../pages/planner.po';
import { DateTimeHelper } from '../utils/date-time-helper';
import { Judges, JudgesCodes } from '../enums/judges';
import { RoomCodes, Rooms } from '../enums/rooms';
import { SessionTypes, SessionTypesCodes } from '../enums/session-types';
import { Logger } from '../utils/logger';
import { SessionHelper } from '../utils/session-helper';
import { ElementHelper } from '../utils/element-helper';

const loginFlow = new LoginFlow();
const navigationFlow = new NavigationFlow();
const plannerPage = new PlannerPage();
const elementHelper = new ElementHelper();

let today = moment();
let numberOfVisibleEvents: number;
let visibleElementsDiff: number;
let resourceId: string;
let shouldContain: string[];
let sessionsToCreate: SessionCreate[];

fdescribe('Planner, check newly created sessions existence', () => {

    beforeAll(async () => {
        await loginFlow.relogin();
        await navigationFlow.gotoPlannerPage();
        await plannerPage.clickJudgeViewButton();
        await plannerPage.openDayView();
        await plannerPage.clickTodayButton();

        today = DateTimeHelper.generateRandomTimeDuringWorkHours(moment());
        sessionsToCreate =
            [
                SessionHelper.generateSessionCreateJson(today, SessionTypesCodes[SessionTypes.FTRACK_TRIAL_ONLY]),
                SessionHelper.generateSessionCreateJson(today, SessionTypesCodes[SessionTypes.FTRACK_TRIAL_ONLY],
                    JudgesCodes[Judges.AMY_WESSOME]),
                SessionHelper.generateSessionCreateJson(today.clone().minute(15), SessionTypesCodes[SessionTypes.FTRACK_TRIAL_ONLY],
                    JudgesCodes[Judges.AMY_WESSOME], RoomCodes[Rooms.COURT_4]),
                SessionHelper.generateSessionCreateJson(today.clone().minute(15), SessionTypesCodes[SessionTypes.FTRACK_TRIAL_ONLY],
                    JudgesCodes[Judges.JUDGE_LINDA])
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
            resourceId = await plannerPage.getResourceIdByName('Not allocated');

            shouldContain = ['No Room', 'No Judge', SessionTypes.FTRACK_TRIAL_ONLY];
            let found = elementHelper.doesElementContainAllValues(
                await plannerPage.getSessionEventById(sessionsToCreate[0].id), ...shouldContain);
            expect(found).toBeTruthy();
        });

        it('after a click open properly filled dialog', async () => {
            let event = await plannerPage.getSessionEventById(sessionsToCreate[0].id);
            const valuesToCheck: string[] = [
                today.format('DD/MM/YYYY'),
                SessionTypes.FTRACK_TRIAL_ONLY,
                '(No judge)',
                '(No room)'
            ];
            await plannerPage.clickAndValidateDialogContent(event, valuesToCheck);
        });

        it('There should be at least one Session allocated to First judge', async () => {
            resourceId = await plannerPage.getResourceIdByName(Judges.JUDGE_LINDA);

            shouldContain = ['No Room', Judges.JUDGE_LINDA, SessionTypes.FTRACK_TRIAL_ONLY];
            let found = elementHelper.doesElementContainAllValues(
                await plannerPage.getSessionEventById(sessionsToCreate[3].id), ...shouldContain);
            expect(found).toBeTruthy();
        });

        it('after a click open properly filled dialog', async () => {
            let event = await plannerPage.getSessionEventById(sessionsToCreate[3].id);
            const valuesToCheck: string[] = [
                today.format('DD/MM/YYYY'),
                SessionTypes.FTRACK_TRIAL_ONLY,
                Judges.JUDGE_LINDA,
                '(No room)'
            ];
            await plannerPage.clickAndValidateDialogContent(event, valuesToCheck);
        });

        it('There should be at least two Session allocated to Second judge - prepare', async () => {
            resourceId = await plannerPage.getResourceIdByName(Judges.AMY_WESSOME);

            const foundedEvents = plannerPage.getAllEventsForTheResource(resourceId).count();
            expect(foundedEvents).toBeGreaterThanOrEqual(2);
        });

        it('check first session', async () => {
            let event = await plannerPage.getSessionEventById(sessionsToCreate[1].id);
            shouldContain = ['No Room', Judges.AMY_WESSOME, SessionTypes.FTRACK_TRIAL_ONLY];
            let found = elementHelper.doesElementContainAllValues(event, ...shouldContain);
            expect(found).toBeTruthy();

            const valuesToCheck: string[] = [
                today.format('DD/MM/YYYY'),
                SessionTypes.FTRACK_TRIAL_ONLY,
                Judges.AMY_WESSOME,
                '(No room)'
            ];
            await plannerPage.clickAndValidateDialogContent(event, valuesToCheck);
        });

        it('check second session', async () => {
            let event = await plannerPage.getSessionEventById(sessionsToCreate[2].id);
            shouldContain = [Rooms.COURT_4, Judges.AMY_WESSOME, SessionTypes.FTRACK_TRIAL_ONLY];
            let found = elementHelper.doesElementContainAllValues(event, ...shouldContain);
            expect(found).toBeTruthy();

            const valuesToCheck: string[] = [
                today.format('DD/MM/YYYY'),
                SessionTypes.FTRACK_TRIAL_ONLY,
                Judges.AMY_WESSOME,
                Rooms.COURT_4
            ];
            await plannerPage.clickAndValidateDialogContent(event, valuesToCheck);
        });
    });

});
