import { TestBed, inject } from '@angular/core/testing';

import { HearingService } from './hearing.service';

describe('HearingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HearingService]
    });
  });

  it('should be created', inject([HearingService], (service: HearingService) => {
    expect(service).toBeTruthy();
  }));
});
