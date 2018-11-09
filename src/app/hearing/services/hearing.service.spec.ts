import { TestBed } from '@angular/core/testing';

import { HearingService } from './hearing.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfig } from '../../app.config';
import { NotesPopulatorService } from '../../notes/services/notes-populator.service';
import { Hearing } from '../models/hearing';
import { DEFAULT_SEARCH_HEARING_REQUEST } from '../../hearing-part/models/search-hearing-request';
import { Page } from '../../problems/models/problem.model';

let service: HearingService;
let httpMock: HttpTestingController;

const filteredHearingViewModelResponse = {
    'id': '6425fe9e-43d9-4abb-b122-26a681cd6c33',
    'caseNumber': 'edited-number-2018-10-19 12:30:03',
    'caseTitle': 'edited-title-2018-10-19 12:30:03',
    'caseTypeCode': 'fast-track',
    'caseTypeDescription': 'Fast Track',
    'hearingTypeCode': 'adjourned-hearing',
    'hearingTypeDescription': 'Adjourned Hearing',
    'duration': 'PT45M',
    'scheduleStart': '2018-10-18T22:00:00Z',
    'scheduleEnd': '2018-10-19T22:00:00Z',
    'reservedJudgeId': null,
    'reservedJudgeName': null,
    'communicationFacilitator': null,
    'priority': 'Low',
    'version': 1,
    'listingDate': '2018-10-18T22:00:00Z',
    'isListed': false
};

const filteredHearingViewModelPage: Page<Object> = {
    'content': [filteredHearingViewModelResponse],
    'last': false,
    'totalElements': 121,
    'totalPages': 7,
    'size': 20,
    'number': 0,
    'sort': null,
    'first': true,
    'numberOfElements': 20
}

describe('HearingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        HearingService,
        {
          provide: NotesPopulatorService, useValue: {
            populateWithNotes: function (data) {
              data['notes'] = ['note'];
              return data;
            }
          }
        },
        {
          provide: AppConfig, useValue: {
            getApiUrl: function () {
              return '';
            }
          }
        }
      ]
    }).compileComponents();

    service = TestBed.get(HearingService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  })

  describe('getByid', () => {
    it('getById should return data from service populated with notes', () => {
      const id = 'some-id';

      service.getById(id).subscribe((res: any) => {
        expect(res).toEqual({
          'id': id,
          'notes': ['note']
        });
      });

      const request = httpMock.expectOne(`/hearing/${id}/with-sessions`);
      request.flush({id: id} as Hearing);

      httpMock.verify();
    });
  })


  describe('seearchFilteredHearingViewmodels', () => {
      const expectedUrl = `/hearing`;

      it('should call proper url', () => {
          service.seearchFilteredHearingViewmodels(DEFAULT_SEARCH_HEARING_REQUEST).subscribe();

          httpMock.expectOne(expectedUrl).flush(filteredHearingViewModelPage);
      });

      it('should map to dates', () => {
          service.seearchFilteredHearingViewmodels(DEFAULT_SEARCH_HEARING_REQUEST).subscribe(data => {
              expect(data.content[0].scheduleStart.isValid).toBeTruthy();
              expect(data.content[0].scheduleEnd.isValid).toBeTruthy();
              expect(data.content[0].listingDate.isValid).toBeTruthy();
          });

          httpMock.expectOne(expectedUrl).flush(filteredHearingViewModelPage);
      });
  });
});
