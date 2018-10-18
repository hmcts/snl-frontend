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

describe('StoreService', () => {
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

    describe('getCaseTypes', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/reference/case-types`;

        it('should call proper url', () => {
            referenceDataService.getCaseTypes().subscribe(
                data => expect(data).toEqual([])
            );
            httpMock.expectOne(expectedUrl).flush([]);
        });
    });
    describe('getHearingTypes', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/reference/hearing-types`;

        it('should call proper url', () => {
            referenceDataService.getHearingTypes().subscribe(
                data => expect(data).toEqual([])
            );
            httpMock.expectOne(expectedUrl).flush([]);
        });
    });
    describe('getSessionTypes', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/reference/session-types`;

        it('should call proper url', () => {
            referenceDataService.getSessionTypes().subscribe(
                data => expect(data).toEqual([])
            );
            httpMock.expectOne(expectedUrl).flush([]);
        });
    });
    describe('getRoomTypes', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/reference/room-types`;

        it('should call proper url', () => {
            referenceDataService.getRoomTypes().subscribe(
                data => expect(data).toEqual([])
            );
            httpMock.expectOne(expectedUrl).flush([]);
        });
    });
});
