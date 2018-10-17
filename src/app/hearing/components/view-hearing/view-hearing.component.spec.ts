import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHearingComponent } from './view-hearing.component';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { ActivatedRoute } from '@angular/router';
import { HearingService } from '../../services/hearing.service';
import { Observable } from 'rxjs/Observable';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { Observable } from 'rxjs/Observable';

const HEARING_ID = 'some-id';

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
                get: function(param: string) {
                  return HEARING_ID;
                }
              }
            }
          }
        },
        {
          provide: HearingService,
          useValue:
          // jasmine.createSpyObj('HearingService', ['getById'])
            {
              getById: function (id: string) {
                return Observable.of(id);
              }
            }

        }
      ],
      declarations: [
        ViewHearingComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewHearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    console.log(component);

    expect(component).toBeTruthy();
  });

  it('formatDate formats date', () => {
    const date = component.formatDate('2012-07-14T01:00:00+01:00');
    expect(date).toEqual('2012/07/14');
  });

  it('formatDuration formats duration with minutes', () => {
    const duration = component.formatDuration(10000);
    expect(duration).toEqual('167 minutes');
  });
});
