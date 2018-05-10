import { TestBed, inject } from '@angular/core/testing';

import { HearingPartService } from './hearing-part.service';
import { AppConfig } from '../../app.config';
import { HttpClient } from '@angular/common/http';

describe('HearingPartService', () => {
  beforeEach(() => {
      TestBed.configureTestingModule({
          providers : [ HearingPartService,
              {
                  provide : HttpClient,
                  useClass : class {
                      http = jasmine.createSpy('http');
                  }
              },
              {
                  provide : AppConfig,
                  useClass : class {
                     config = jasmine.createSpy('config');
                  }
              }],
      });
  });

  it('should be created', inject([HearingPartService], (service: HearingPartService) => {
    expect(service).toBeTruthy();
  }));
});
