import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaryCalendarComponent } from './diary-calendar.component';

describe('DiaryCalendarComponent', () => {
  let component: DiaryCalendarComponent;
  let fixture: ComponentFixture<DiaryCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiaryCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiaryCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
