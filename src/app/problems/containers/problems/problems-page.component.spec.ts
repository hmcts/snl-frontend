import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemsPageComponent } from './problems-page.component';

describe('ProblemsPageComponent', () => {
  let component: ProblemsPageComponent;
  let fixture: ComponentFixture<ProblemsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProblemsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
