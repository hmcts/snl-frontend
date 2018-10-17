import { TestBed, inject } from '@angular/core/testing';

import { HearingService } from './hearing.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfig } from '../../app.config';
import { NotesPopulatorService } from '../../notes/services/notes-populator.service';
import { NotesService } from '../../notes/services/notes.service';

const mockedAppConfig = {};

describe('HearingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        HearingService,
        NotesPopulatorService,
        NotesService,
        { provide: AppConfig, useValue: mockedAppConfig }
      ]
    });
  });

  it('should be created', inject([HearingService], (service: HearingService) => {
    expect(service).toBeTruthy();
  }))

  describe('getByid', () => {
    it('getById should return observable', () => {

    });
  })
});
