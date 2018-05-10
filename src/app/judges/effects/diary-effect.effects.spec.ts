import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/Observable';

import { DiaryEffectEffects } from './diary-effect.effects';
import { DiaryService } from '../services/diary.service';

describe('DiaryEffectService', () => {
  let actions$: Observable<any>;
  let effects: DiaryEffectEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers : [ DiaryEffectEffects,
        {
          provide : DiaryService,
          useClass : class {
              diaryService = jasmine.createSpy('diaryService');
          }
        },
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(DiaryEffectEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
