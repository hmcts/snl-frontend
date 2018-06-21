import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AppConfig } from '../../app.config';
import * as moment from 'moment';
import { SessionsService } from './sessions-service';
import { SessionCreate } from '../models/session-create.model';
import {
  getSessionResponse,
  normalizedGetSessionResponse,
  getSessionsResponse,
  normalizedGetSessionsResponse,
  getSessionsWithHearingsResponse,
  normalizedGetSessionsWithHearings
} from './test-data/sessions-service-test-data';

const sessionID = 'some-session-id';
const mockedAppConfig = { getApiUrl: () => 'https://google.co.uk' };
const format = 'DD-MM-YYYY';
const startDayString = '01-01-2019';
const endDayString = '02-02-2019';
const judgeUsername = 'Andrew Smith';
const expectedGetSessionsByJudgeAndDateURL =
  `${mockedAppConfig.getApiUrl()}/sessions/judge-diary?` +
  `judge=${judgeUsername}` +
  `&startDate=${startDayString}` +
  `&endDate=${endDayString}`;

let httpMock: HttpTestingController;
let sessionsService: SessionsService;

const verifyIfSessionsAreNormalized = (data: any) => {
  expect(data).toEqual(normalizedGetSessionsResponse);
};

const verifyIfSessionsWithHearingsAreNormalized = (data: any) => {
  expect(data).toEqual(normalizedGetSessionsWithHearings);
};

describe('SessionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SessionsService,
        { provide: AppConfig, useValue: mockedAppConfig }
      ]
    });
    sessionsService = TestBed.get(SessionsService);
    httpMock = TestBed.get(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  describe('getSession', () => {
    const expectedGetSessionURL = `${mockedAppConfig.getApiUrl()}/sessions/${sessionID}`;

    it('should build valid URL', () => {
      sessionsService.getSession(sessionID).subscribe();
      httpMock.expectOne(expectedGetSessionURL).flush(getSessionResponse);
    });

    it('should return normalized data', () => {
      sessionsService
        .getSession(sessionID)
        .subscribe(data => expect(data).toEqual(normalizedGetSessionResponse));

      httpMock.expectOne(expectedGetSessionURL).flush(getSessionResponse);
    });
  });

  describe('searchSessions', () => {
    const date = new Date();
    const expectedGetSessionURL = `${mockedAppConfig.getApiUrl()}/sessions?date=${date}`;
    const sessionQuery = { date };

    it('should build valid URL', () => {
      sessionsService.searchSessions(sessionQuery).subscribe();
      httpMock.expectOne(expectedGetSessionURL).flush(getSessionResponse);
    });

    it('should return normalized data', () => {
      sessionsService
        .searchSessions(sessionQuery)
        .subscribe(verifyIfSessionsAreNormalized);
      httpMock.expectOne(expectedGetSessionURL).flush(getSessionsResponse);
    });
  });

  describe('searchSessionsForDates', () => {
    const expectedGetSessionsByDateURL =
      `${mockedAppConfig.getApiUrl()}` +
      `/sessions?startDate=${startDayString}` +
      `&endDate=${endDayString}`;
    const sessionQueryForDates = {
      startDate: moment(startDayString, format).toDate(),
      endDate: moment(endDayString, format).toDate()
    };

    it('should build valid URL', () => {
      sessionsService.searchSessionsForDates(sessionQueryForDates).subscribe();
      httpMock
        .expectOne(expectedGetSessionsByDateURL)
        .flush(getSessionResponse);
    });

    it('should return normalized data', () => {
      sessionsService
        .searchSessionsForDates(sessionQueryForDates)
        .subscribe(verifyIfSessionsWithHearingsAreNormalized);

      httpMock
        .expectOne(expectedGetSessionsByDateURL)
        .flush(getSessionsWithHearingsResponse);
    });
  });

  describe('searchSessionsForJudge', () => {
    const diaryLoadParameters = {
      startDate: moment(startDayString, format).toDate(),
      endDate: moment(endDayString, format).toDate(),
      judgeUsername
    };

    it('should build valid URL', () => {
      sessionsService.searchSessionsForJudge(diaryLoadParameters).subscribe();
      httpMock
        .expectOne(expectedGetSessionsByJudgeAndDateURL)
        .flush(getSessionResponse);
    });

    it('should return normalized data', () => {
      sessionsService
        .searchSessionsForJudge(diaryLoadParameters)
        .subscribe(verifyIfSessionsAreNormalized);

      httpMock
        .expectOne(expectedGetSessionsByJudgeAndDateURL)
        .flush(getSessionsResponse);
    });
  });

  describe('searchSessionsForJudgeWithHearings', () => {
    const diaryLoadParameters = {
      startDate: moment(startDayString, format).toDate(),
      endDate: moment(endDayString, format).toDate(),
      judgeUsername
    };

    it('should build valid URL', () => {
      sessionsService
        .searchSessionsForJudgeWithHearings(diaryLoadParameters)
        .subscribe();

      httpMock
        .expectOne(expectedGetSessionsByJudgeAndDateURL)
        .flush(getSessionResponse);
    });

    it('should return normalized data', () => {
      sessionsService
        .searchSessionsForJudgeWithHearings(diaryLoadParameters)
        .subscribe(data =>
          expect(data).toEqual(normalizedGetSessionsWithHearings)
        );

      httpMock
        .expectOne(expectedGetSessionsByJudgeAndDateURL)
        .flush(getSessionsWithHearingsResponse);
    });
  });

  describe('createSession', () => {
    const expectedCreateSessionsURL = `${mockedAppConfig.getApiUrl()}/sessions`;
    const dummySession: SessionCreate = {
      id: 'some-id',
      userTransactionId: 'some-user-transaction-id',
      personId: 'some-person-id',
      roomId: 'some-room-id',
      duration: 30,
      start: new Date(),
      caseType: 'some-case-type'
    };

    it('should build valid URL with body', () => {
      sessionsService.createSession(dummySession).subscribe();
      const req = httpMock.expectOne(expectedCreateSessionsURL);
      expect(req.request.body).toEqual(dummySession);
      req.flush(null);
    });

    it('should make PUT request', () => {
      sessionsService.createSession(dummySession).subscribe();
      const req = httpMock.expectOne(expectedCreateSessionsURL);
      expect(req.request.method).toBe('PUT');
      req.flush(null);
    });
  });
});
