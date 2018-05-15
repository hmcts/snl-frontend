import { TestBed, inject } from '@angular/core/testing';

import { ProblemsService } from './problems.service';

describe('ProblemsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProblemsService]
    });
  });

  it('should be created', inject([ProblemsService], (service: ProblemsService) => {
    expect(service).toBeTruthy();
  }));
});
