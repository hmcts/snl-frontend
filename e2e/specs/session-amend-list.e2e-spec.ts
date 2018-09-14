import { NavigationFlow } from '../flows/navigation.flow';
import { SessionAmendListPage } from '../pages/session-amend-list.po';
import { FilterSessionsComponentForm } from '../models/filter-sessions-component-form';
import * as moment from 'moment';
import { SessionTypes } from '../enums/session-types';
import { LoginFlow } from '../flows/login.flow';
import { SessionCreate } from '../../src/app/sessions/models/session-create.model';
import { API } from '../utils/api';
import { v4 as uuid } from 'uuid';

const navigationFlow = new NavigationFlow();
const sessionAmendListPage = new SessionAmendListPage();
const loginFlow = new LoginFlow();

const now = moment().add(5, 'minute');
const todayDate = now.format('DD/MM/YYYY');
const tomorrowDate = now.add(1, 'day').format('DD/MM/YYYY');
const sessionType = SessionTypes.FTRACK_TRIAL_ONLY;
const sessionId = uuid();

const formValues: FilterSessionsComponentForm = {
    startDate: todayDate,
    endDate: tomorrowDate,
    sessionType: sessionType,
    room: undefined,
    judge: undefined,
    listingDetailsOptions: {
        unlisted: false,
        partListed: false,
        fullyListed: false,
        overListed: false,
        customListed: {
            checked: false,
            from: 0,
            to: 0,
        }
    }
};

const sessionCreate: SessionCreate = {
    id: sessionId,
    userTransactionId: uuid(),
    personId: null,
    roomId: null,
    duration: 1800,
    start: now,
    sessionTypeCode: 'fast-track---trial-only',
    caseType: undefined
};

describe('Go to search session', () => {
    beforeAll(async () => {
        await loginFlow.loginIfNeeded();
        expect(await API.createSession(sessionCreate)).toEqual(200);
    });

    it('click filter and see some sessions', async () => {
        await navigationFlow.goToAmendSessionsListPage();

        await sessionAmendListPage.filterSession(formValues);

        expect(await sessionAmendListPage.isSessionDisplayed(sessionId)).toBeTruthy()
    });

    fit('click filter and edit session', async () => {
        await navigationFlow.goToAmendSessionsListPage();

        await sessionAmendListPage.filterSession(formValues);
        await sessionAmendListPage.clickEditOnSession(sessionId);

        expect(await sessionAmendListPage.isSessionDisplayed(sessionId)).toBeTruthy()
    });
});
