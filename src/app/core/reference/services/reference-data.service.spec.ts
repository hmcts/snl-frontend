import { TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { AppConfig } from '../../../app.config';
import { ReferenceDataService } from './reference-data.service';

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

        it('should call proper url', () => {
            referenceDataService.fetchCaseTypes().subscribe(
                data => expect(data).toEqual([])
            );
            httpMock.expectOne(expectedUrl).flush([]);
        });
    });
    describe('fetchHearingTypes', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/reference/hearing-types`;

        it('should call proper url', () => {
            referenceDataService.fetchHearingTypes().subscribe(
                data => expect(data).toEqual([])
            );
            httpMock.expectOne(expectedUrl).flush([]);
        });
    });
    describe('fetchSessionTypes', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/reference/session-types`;

        it('should call proper url', () => {
            referenceDataService.fetchSessionTypes().subscribe(
                data => expect(data).toEqual([])
            );
            httpMock.expectOne(expectedUrl).flush([]);
        });
    });
    describe('fetchRoomTypes', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/reference/room-types`;

        it('should call proper url', () => {
            referenceDataService.fetchRoomTypes().subscribe(
                data => expect(data).toEqual([])
            );
            httpMock.expectOne(expectedUrl).flush([]);
        });
    });
});
