import { NavigationFlow } from '../flows/navigation.flow';
import { SessionAmendListPage } from '../pages/session-amend-list.po';
import { FilterSessionsComponentForm } from '../models/filter-sessions-component-form';
import * as moment from 'moment';
import { SessionTypes } from '../enums/session-types';
import { LoginFlow } from '../flows/login.flow';
import { SessionCreate } from '../../src/app/sessions/models/session-create.model';
import { API } from '../utils/api';
import { v4 as uuid } from 'uuid';
import { SessionAmendForm } from '../models/session-amend-form';
import { SessionAmendDialog } from '../pages/session-amend-dialog.po';
import { TransactionDialogPage } from '../pages/transaction-dialog.po';

const navigationFlow = new NavigationFlow();
const sessionAmendListPage = new SessionAmendListPage();
const loginFlow = new LoginFlow();
const sessionAmendDialog = new SessionAmendDialog();
const transactionDialogPage = new TransactionDialogPage();

const now = moment().add(5, 'minute');
const todayDate = now.format('DD/MM/YYYY');
const tomorrowDate = now.add(1, 'day').format('DD/MM/YYYY');
const sessionType = SessionTypes.FTRACK_TRIAL_ONLY;
const sessionId = uuid();

const filterFormValues: FilterSessionsComponentForm = {
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
    sessionTypeCode: 'fast-track---trial-only'
};

describe('Go to search session', () => {
    beforeAll(async () => {
        await loginFlow.relogin();
        expect(await API.createSession(sessionCreate)).toEqual(200);
    });

    it('click filter and see some sessions', async () => {
        await navigationFlow.goToAmendSessionsListPage();
        await sessionAmendListPage.filterSession(filterFormValues);
        expect(await sessionAmendListPage.isSessionDisplayed(sessionId)).toBeTruthy()
    });

    it('click filter and edit session', async () => {
        await navigationFlow.goToAmendSessionsListPage();
        await sessionAmendListPage.filterSession(filterFormValues);
        await sessionAmendListPage.amendSession(sessionId);

        const form: SessionAmendForm = {
            sessionTypeCode: SessionTypes.MTRACK_TRIAL_ONLY,
            startTime: '12:00',
            durationInMinutes: 15
        };

        await sessionAmendDialog.amendSession(form);
        await transactionDialogPage.clickAcceptButton();

        let filterFormPostAmend = {
            ...filterFormValues,
            sessionType: SessionTypes.MTRACK_TRIAL_ONLY,
        }

        await sessionAmendListPage.filterSession(filterFormPostAmend);
        expect(await sessionAmendListPage.isSessionDisplayed(sessionId)).toBeTruthy()
    });
});
