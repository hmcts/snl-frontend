import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHearingComponent } from './view-hearing.component';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { ActivatedRoute } from '@angular/router';
import { HearingService } from '../../services/hearing.service';
import { Observable } from 'rxjs/Observable';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Hearing } from '../../models/hearing';
import * as moment from 'moment';
// import { Observable } from 'rxjs/Observable';

const HEARING_ID = 'some-id';

// @ts-ignore is better than defining default format as const we need to pass to every format() call
moment.defaultFormat = 'DD/MM/YYYY';

const START_DATE = '01/01/2010';
const ISO_START_DATE = '2010-01-01T00:00:00+00:00';
const END_DATE = '12/12/2012';
const ISO_END_DATE = '2012-12-12T00:00:00+00:00';

describe('ViewHearingComponent', () => {
  let component: ViewHearingComponent;
  let fixture: ComponentFixture<ViewHearingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularMaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: function (param: string) {
                  return HEARING_ID;
                }
              }
            }
          }
        },
        {
          provide: HearingService,
          useValue:
            {
              getById: function (id: string) {
                return Observable.of();
              }
            }

        }
      ],
      declarations: [
        ViewHearingComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewHearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getBetween returns proper AFTER period', () => {
    component.hearing = {
      scheduleStart: ISO_START_DATE,
      scheduleEnd: null
    } as Hearing;

    expect(component.getListBetween()).toEqual('after ' + START_DATE);
  });

  it('getBetween returns proper BEFORE period', () => {
    component.hearing = {
      scheduleStart: null,
      scheduleEnd: ISO_END_DATE
    } as Hearing;

    expect(component.getListBetween()).toEqual('before ' + END_DATE);
  });

  it('getBetween returns proper FULL period', () => {
    component.hearing = {
      scheduleStart: ISO_START_DATE,
      scheduleEnd: ISO_END_DATE
    } as Hearing;

    expect(component.getListBetween()).toEqual( START_DATE + ' - ' + END_DATE);
  });

  it('getBetween returns proper NULL period', () => {
    component.hearing = {
      scheduleStart: null,
      scheduleEnd: null
    } as Hearing;

    expect(component.getListBetween()).toEqual('');
  });

  it('formatDuration formats duration with minutes', () => {
    const duration = component.formatDuration('PT30M');
    expect(duration).toEqual('30 minutes');
  });
});
