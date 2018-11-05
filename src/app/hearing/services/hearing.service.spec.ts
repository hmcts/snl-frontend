import { TestBed } from '@angular/core/testing';

import { HearingService } from './hearing.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfig } from '../../app.config';
import { NotesPopulatorService } from '../../notes/services/notes-populator.service';
import { Hearing } from '../models/hearing';
import { Store } from '@ngrx/store';
import { HttpRequest } from '@angular/common/http';

let service: HearingService;
let httpMock: HttpTestingController;
let mockStore = jasmine.createSpyObj<Store<any>>('Store', ['dispatch']);
const HEARING: Hearing = {
  id: 'some-id',
  hearingPartsVersions: [{id: 'id1', version: 'ver1'}]
} as Hearing

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
      service.getById(id)

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
});
