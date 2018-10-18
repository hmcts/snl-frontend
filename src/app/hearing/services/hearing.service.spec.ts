import { TestBed } from '@angular/core/testing';

import { HearingService } from './hearing.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfig } from '../../app.config';
import { NotesPopulatorService } from '../../notes/services/notes-populator.service';
import { Hearing } from '../models/hearing';

let service: HearingService;
let httpMock: HttpTestingController;

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
    fit('getById should return data from service populated with notes', () => {
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
});
