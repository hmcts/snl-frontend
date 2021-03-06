import { UpdateHearingRequest } from '../models/update-hearing-request';
import { CreateHearingRequest } from '../models/create-hearing-request';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfig } from '../../app.config';
import { HearingPartService } from './hearing-part-service';
import moment = require('moment');
import { v4 as uuid } from 'uuid';
import { HearingPartToSessionAssignment } from '../models/hearing-to-session-assignment';
const mockedAppConfig = { getApiUrl: () => 'https://google.co.uk' };

let hearingPartService: HearingPartService;
let httpMock: HttpTestingController;

const hearingPartResponse = {
    sessionId: undefined,
    id: 'ba766510-e898-4919-8d3b-25f3e1b932aa',
    version: undefined,
    hearingInfo: {
        version: undefined,
        id: 'ba766510-e898-4919-8d3b-25f3e1b932aa',
        caseNumber: 'number-2018-08-27T09:55:24.172Z',
        caseTitle: 'title-2018-08-27T09:55:24.172Z',
        caseTypeCode: 'SCLAIMS',
        hearingTypeCode: 'Preliminary Hearing',
        duration: 'PT30M',
        scheduleStart: '2018-08-27T09:55:24.172Z',
        scheduleEnd: '2018-09-26T09:55:24.174Z',
        reservedJudgeId: null,
        communicationFacilitator: null,
        priority: null,
        deleted: false,
    }
};

const normalizedHearingPartsResponse = {
    entities: {
        hearingParts: {
            'ba766510-e898-4919-8d3b-25f3e1b932aa': {
                sessionId: undefined,
                id: 'ba766510-e898-4919-8d3b-25f3e1b932aa',
                hearingInfo: 'ba766510-e898-4919-8d3b-25f3e1b932aa',
                version: undefined,
            }
        },
        hearings: {
            'ba766510-e898-4919-8d3b-25f3e1b932aa': {
                version: undefined,
                id: 'ba766510-e898-4919-8d3b-25f3e1b932aa',
                caseNumber: 'number-2018-08-27T09:55:24.172Z',
                caseTitle: 'title-2018-08-27T09:55:24.172Z',
                caseTypeCode: 'SCLAIMS',
                hearingTypeCode: 'Preliminary Hearing',
                duration: 'PT30M',
                scheduleStart: '2018-08-27T09:55:24.172Z',
                scheduleEnd: '2018-09-26T09:55:24.174Z',
                reservedJudgeId: null,
                communicationFacilitator: null,
                priority: null,
                deleted: false
            }
        }
    }, result: ['ba766510-e898-4919-8d3b-25f3e1b932aa']
};

const normalizedHearingPartResponse = {
    entities: {
        hearingParts: {
            'ba766510-e898-4919-8d3b-25f3e1b932aa':
                {
                    sessionId: undefined,
                    id: 'ba766510-e898-4919-8d3b-25f3e1b932aa',
                    hearingInfo: 'ba766510-e898-4919-8d3b-25f3e1b932aa',
                    version: undefined,
                }
        },
        hearings: {
            'ba766510-e898-4919-8d3b-25f3e1b932aa': {
                version: undefined,
                id: 'ba766510-e898-4919-8d3b-25f3e1b932aa',
                caseNumber: 'number-2018-08-27T09:55:24.172Z',
                caseTitle: 'title-2018-08-27T09:55:24.172Z',
                caseTypeCode: 'SCLAIMS',
                hearingTypeCode: 'Preliminary Hearing',
                duration: 'PT30M',
                scheduleStart: '2018-08-27T09:55:24.172Z',
                scheduleEnd: '2018-09-26T09:55:24.174Z',
                reservedJudgeId: null,
                communicationFacilitator: null,
                priority: null,
                deleted: false
            }
        }
    }, result: 'ba766510-e898-4919-8d3b-25f3e1b932aa'
};

const sessionAssignment: HearingPartToSessionAssignment = {
    userTransactionId: 'transaction-id',
    hearingPartId: 'ba766510-e898-4919-8d3b-25f3e1b932aa',
    hearingPartVersion: 0,
    start: new Date(),
    sessionData: {
        sessionId: 'session-id',
        sessionVersion: 0
    }
};

const hearingParts = [hearingPartResponse];

const createHearingPartRequest: CreateHearingRequest = {
    id: 'ba766510-e898-4919-8d3b-25f3e1b932aa',
    caseNumber: 'number-2018-08-27T09:55:24.172Z',
    caseTitle: 'title-2018-08-27T09:55:24.172Z',
    caseTypeCode: 'SCLAIMS',
    hearingTypeCode: 'Preliminary Hearing',
    duration: moment.duration('PT30M'),
    scheduleStart: moment('2018-08-27T09:55:24.172Z'),
    scheduleEnd: moment('2018-09-26T09:55:24.174Z'),
    reservedJudgeId: null,
    communicationFacilitator: null,
    priority: null,
    userTransactionId: uuid(),
    numberOfSessions: 1,
    multiSession: false
};

const updateHearingPartRequest: UpdateHearingRequest = {
    ...createHearingPartRequest,
    version: 1
};

describe('HearingPartService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                HearingPartService,
                { provide: AppConfig, useValue: mockedAppConfig }
            ]
        });
        hearingPartService = TestBed.get(HearingPartService);
        httpMock = TestBed.get(HttpTestingController);
    });
    afterEach(() => {
        httpMock.verify();
    });

    describe('searchHearingParts', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/hearing-part?isListed=false`;

        it('should build proper url', () => {
            hearingPartService.searchHearingParts({ isListed: false }).subscribe();

            httpMock.expectOne(expectedUrl).flush(hearingParts);
        });

        it('should return normalized data', () => {
            hearingPartService.searchHearingParts({ isListed: false })
                .subscribe(data => expect(data).toEqual(normalizedHearingPartsResponse));

            httpMock.expectOne(expectedUrl).flush(hearingParts);
        });
    });

    describe('getById', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/hearing-part/ba766510-e898-4919-8d3b-25f3e1b932aa`;

        it('should build proper url', () => {
            hearingPartService.getById(hearingPartResponse.id).subscribe();

            httpMock.expectOne(expectedUrl).flush(hearingParts);
        });

        it('should return normalized data', () => {
            hearingPartService.getById(hearingPartResponse.id)
                .subscribe(data => expect(data).toEqual(normalizedHearingPartResponse));

            httpMock.expectOne(expectedUrl).flush(hearingPartResponse);
        });
    })

    describe('assignToSessions', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/hearing-part/ba766510-e898-4919-8d3b-25f3e1b932aa`;

        it('should build proper url', () => {
            hearingPartService.assignToSession(sessionAssignment).subscribe();

            httpMock.expectOne(expectedUrl).flush(hearingPartResponse);
        });
    });

    describe('createListing', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/hearing-part/create`;

        it('should build proper url', () => {
            hearingPartService.createListing(createHearingPartRequest).subscribe();

            httpMock.expectOne(expectedUrl).flush(hearingPartResponse);
        });
    });

    describe('updateListing', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/hearing-part/update`;

        it('should build proper url', () => {
            hearingPartService.updateListing(updateHearingPartRequest).subscribe();

            httpMock.expectOne(expectedUrl).flush(hearingPartResponse);
        });
    });
});
