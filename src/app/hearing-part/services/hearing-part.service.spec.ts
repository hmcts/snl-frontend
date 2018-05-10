import { TestBed, inject } from '@angular/core/testing';

import { HearingPartService } from './hearing-part.service';

describe('HearingPartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HearingPartService]
    });
  });

  it('should be created', inject([HearingPartService], (service: HearingPartService) => {
    expect(service).toBeTruthy();
  }));
});
