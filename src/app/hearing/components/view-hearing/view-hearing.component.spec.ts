import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHearingComponent } from './view-hearing.component';

describe('ViewHearingComponent', () => {
  let component: ViewHearingComponent;
  let fixture: ComponentFixture<ViewHearingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewHearingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
