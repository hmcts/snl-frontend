import { ActivityLogService } from './activity-log.service';
import { AppConfig } from '../../../app.config';
import { ActivityLogResponse } from '../models/activity-log.model';
import moment = require('moment');
import { Observable } from 'rxjs';

const fakeUrl = 'https://fake.hmcts.net';
const mockedAppConfig = {
    getApiUrl: () => fakeUrl,
    createApiUrl: (suffix) => {
        return fakeUrl + suffix;
    }
} as AppConfig;

const mockedHttpClient = jasmine.createSpyObj('httpClient', ['get']);

const ACTIVITY_LOG_RESPONSE: ActivityLogResponse = {
    activityStatus: 'Created',
    createdAt: '2018-12-07T11:29:50.809Z',
    createdBy: 'someone',
    description: undefined
};

const ENTITY_ID = '123';

const activityLogService = new ActivityLogService(mockedHttpClient, mockedAppConfig);

describe('ActivityLogService', () => {
    describe('getActivitiesForEntity', () => {

        it('should map activity log response properly', () => {
            mockedHttpClient.get
                .and.returnValue(Observable.of([ACTIVITY_LOG_RESPONSE]));
            const expectedActivityLogs = [{...ACTIVITY_LOG_RESPONSE, createdAt: moment(ACTIVITY_LOG_RESPONSE.createdAt)}];

            activityLogService.getActivitiesForEntity(ENTITY_ID);

            activityLogService.activityLogs.subscribe(data => {
                expect(data[ENTITY_ID]).toEqual(expectedActivityLogs);
            })
        })
    })
})
