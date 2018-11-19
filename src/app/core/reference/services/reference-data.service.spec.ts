import { TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { AppConfig } from '../../../app.config';
import { ReferenceDataService } from './reference-data.service';
import { RoomType } from '../models/room-type';
import { SessionType } from '../models/session-type';
import { HearingType } from '../models/hearing-type';
import { CaseType } from '../models/case-type';

const mockedAppConfig = { getApiUrl: () => 'https://google.co.uk' };

let httpMock: HttpTestingController;
let referenceDataService: ReferenceDataService;

describe('ReferenceDataService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                ReferenceDataService,
                { provide: AppConfig, useValue: mockedAppConfig }
            ]
        });
        referenceDataService = TestBed.get(ReferenceDataService);
        httpMock = TestBed.get(HttpTestingController);
    });
    afterEach(() => {
        httpMock.verify();
    });

    describe('fetchCaseTypes', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/reference/case-types`;
        const expectedData = [{} as CaseType];

        it('should call proper url', (done) => {
            referenceDataService.fetchCaseTypes().subscribe(
                data => {
                    expect(data).toEqual(expectedData);
                    referenceDataService.getCaseTypes().subscribe(anotherData => {
                        expect(anotherData).toEqual(expectedData);
                        done();
                    })}
            );
            httpMock.expectOne(expectedUrl).flush(expectedData);
        });
    });
    describe('fetchHearingTypes', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/reference/hearing-types`;
        const expectedData = [{} as HearingType];

        it('should call proper url', (done) => {
            referenceDataService.fetchHearingTypes().subscribe(
                data => {
                    expect(data).toEqual(expectedData);
                    referenceDataService.getHearingTypes().subscribe(anotherData => {
                        expect(anotherData).toEqual(expectedData);
                        done();
                    })}
            );
            httpMock.expectOne(expectedUrl).flush(expectedData);
        });
    });
    describe('fetchSessionTypes', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/reference/session-types`;
        const expectedData = [{} as SessionType];

        it('should call proper url', (done) => {
            referenceDataService.fetchSessionTypes().subscribe(
                data => {
                    expect(data).toEqual(expectedData);
                    referenceDataService.getSessionTypes().subscribe(anotherData => {
                        expect(anotherData).toEqual(expectedData);
                        done();
                    })}
            );
            httpMock.expectOne(expectedUrl).flush(expectedData);
        });
    });
    describe('fetchRoomTypes', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/reference/room-types`;
        const expectedData = [{} as RoomType];

        it('should call proper url', (done) => {
            referenceDataService.fetchRoomTypes().subscribe(
                data => {
                    expect(data).toEqual(expectedData);
                    referenceDataService.getRoomTypes().subscribe(anotherData => {
                        expect(anotherData).toEqual(expectedData);
                        done();
                    })}
            );
            httpMock.expectOne(expectedUrl).flush(expectedData);
        });
    });
});
