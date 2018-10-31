import { LoginFlow } from '../flows/login.flow';
import { API } from '../utils/api';
import { NavigationFlow } from '../flows/navigation.flow';
import { SearchListingRequestPage } from '../pages/search-listing-request.po';
import { CaseTypeCodes } from '../enums/case-types';
import { CreateListingRequestBody } from '../models/create-listing-request-body';
import { Priority } from '../../src/app/hearing-part/models/priority-model';
import { HearingTypeCodes } from '../enums/hearing-types';
import { v4 as uuid } from 'uuid';
import { ViewHearingPage } from '../pages/view-hearing.po';

const loginFlow: LoginFlow = new LoginFlow();
const navigationFlow: NavigationFlow = new NavigationFlow();

const searchListingRequestPage: SearchListingRequestPage = new SearchListingRequestPage();
const viewHearingPage: ViewHearingPage = new ViewHearingPage();

const caseNumber = `vh-${new Date().toLocaleString()}`;
const id = uuid();

const createListingRequestWithCaseNumberAndId = async function (givenCaseNumber: string, givenId: string): Promise<number> {
    return API.createListingRequest(
        {
            id: givenId,
            caseNumber: givenCaseNumber,
            caseTitle: '',
            caseTypeCode: CaseTypeCodes.FTRACK,
            hearingTypeCode: HearingTypeCodes.ADJOURNED,
            duration: 'PT30M',
            priority: Priority.High,
            userTransactionId: uuid(),
            numberOfSessions: 1
        } as CreateListingRequestBody
    );
};

describe('View Hearing details', () => {
    beforeAll(async () => {
        await loginFlow.loginIfNeeded();
    });

    describe('I can search for listing request and view it', () => {
        it('Given there is a Listing Request', async () => {
            const statusCode = await createListingRequestWithCaseNumberAndId(caseNumber, id);
            expect(statusCode).toEqual(200);
        });

        it('When I search for it', async () => {
            await navigationFlow.gotoSearchListingRequestPage();
            await searchListingRequestPage.clickFilterButton();
            const isDisplayed = await searchListingRequestPage.isListingRequestDisplayed(caseNumber);
            expect(isDisplayed).toEqual(true);
        });

        it('And click on it', async () => {
            searchListingRequestPage.clickListingRequest(id);
        });

        it('Then Listing Request opens in new page', async () => {
            await viewHearingPage.waitUntilVisible();
            expect(await viewHearingPage.getHeaderText()).toEqual(caseNumber);
        });
    });

});