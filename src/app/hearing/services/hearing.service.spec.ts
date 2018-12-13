import { TestBed } from '@angular/core/testing';

import { HearingService } from './hearing.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfig } from '../../app.config';
import { NotesPopulatorService } from '../../notes/services/notes-populator.service';
import { Hearing } from '../models/hearing';
import { Store } from '@ngrx/store';
import { HttpRequest } from '@angular/common/http';
import { DEFAULT_SEARCH_HEARING_REQUEST } from '../../hearing-part/models/search-hearing-request';
import { Page } from '../../problems/models/problem.model';
import { NotesService } from '../../notes/services/notes.service';
import { DEFAULT_NOTE } from '../../notes/models/note.model';
import { DEFAULT_HEARING_FOR_LISTING_RESPONSE, HearingForListingWithNotes }
  from '../../hearing-part/models/hearing-for-listing-with-notes.model';
import { Observable } from 'rxjs/Observable';

let service: HearingService;
let httpMock: HttpTestingController;
let mockStore = jasmine.createSpyObj<Store<any>>('Store', ['dispatch']);
const HEARING: Hearing = {
  id: 'some-id',
  hearingPartsVersions: [{id: 'id1', version: 'ver1'}],
  version: 4
} as Hearing

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
        NotesService,
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
        },
        { provide: Store, useValue: mockStore }
      ]
    }).compileComponents();

    service = TestBed.get(HearingService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  })

  describe('getById', () => {
    it('should return data from service populated with notes', (done) => {
      const id = 'some-id';
      service.getById(id);

      const request = httpMock.expectOne(`/hearing/${id}/with-sessions`);
      request.flush({id: id} as Hearing);

      service.hearings
      .map(hearings => hearings.find(h => h.id === id))
      .subscribe(hearing => {
        expect(hearing.id).toEqual(id);
        done()
      });

      httpMock.verify();
    });
  })

  describe('unlist', () => {
    it('should call API', () => {
      service.unlist(HEARING)

      httpMock.expectOne((request: HttpRequest<any>) => {
        const body = JSON.parse(request.body);
        return request.method === 'PUT' &&
          request.url === '/hearing/unlist' &&
          body.hearingId === HEARING.id &&
          body.hearingPartsVersions.length === HEARING.hearingPartsVersions.length
      }).flush({});

      httpMock.verify()
    })
  });

  describe('adjourn', () => {
    it('should call API', () => {
      service.adjourn(HEARING, 'description')

      httpMock.expectOne((request: HttpRequest<any>) => {
        const body = JSON.parse(request.body);
        return request.method === 'PUT' &&
          request.url === '/hearing/adjourn' &&
          body.hearingId === HEARING.id &&
          body.hearingVersion === HEARING.version
      }).flush({});

      httpMock.verify()
    })
  });

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

  describe('getHearingsForListing', () => {
      const expectedUrl = `/hearing/for-listing`;

      it('should call proper url', () => {
          spyOn(service.notesService, 'getByEntitiesAsDictionary').and.returnValue(Observable.of({'hearingId': [DEFAULT_NOTE]}))
          service.getHearingsForListing(DEFAULT_SEARCH_HEARING_REQUEST).subscribe();

          httpMock.expectOne(expectedUrl).flush({content: [{...DEFAULT_HEARING_FOR_LISTING_RESPONSE, id: 'hearingId'}]});
      });

      it('should append respective notes', () => {
          spyOn(service.notesService, 'getByEntitiesAsDictionary').and.returnValue(Observable.of({'hearingId': [DEFAULT_NOTE]}))
          service.getHearingsForListing(DEFAULT_SEARCH_HEARING_REQUEST).subscribe((data: Page<HearingForListingWithNotes>) => {
              expect(data.content[0].notes[0]).toEqual(DEFAULT_NOTE);
          });

          httpMock.expectOne(expectedUrl).flush({content: [{...DEFAULT_HEARING_FOR_LISTING_RESPONSE, id: 'hearingId'}]});
      });

      it('if there are no notes fetched it should return empty array', () => {
        spyOn(service.notesService, 'getByEntitiesAsDictionary').and.returnValue(Observable.of({}))
        service.getHearingsForListing(DEFAULT_SEARCH_HEARING_REQUEST).subscribe((data: Page<HearingForListingWithNotes>) => {
            expect(data.content[0].notes).toEqual([]);
        });

        httpMock.expectOne(expectedUrl).flush({content: [{...DEFAULT_HEARING_FOR_LISTING_RESPONSE, id: 'hearingId'}]});
    });
  });
});
