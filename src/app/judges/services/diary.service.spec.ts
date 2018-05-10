import { TestBed, inject } from '@angular/core/testing';

import { DiaryService } from './diary.service';
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "../../app.config";

describe('DiaryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ DiaryService,
				{
					provide: HttpClient,
					useClass: class {
						httpClient = jasmine.createSpy('httpClient');
					}
				},
				{
					provide: AppConfig,
					useClass: class {
						appConfig = jasmine.createSpy('appConfig');
					}
				}],
    });
  });

  it('should be created', inject([DiaryService], (service: DiaryService) => {
    expect(service).toBeTruthy();
  }));
});
