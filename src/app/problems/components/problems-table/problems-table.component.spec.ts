import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemsTableComponent } from './problems-table.component';

describe('ProblemsTableComponent', () => {
  let component: ProblemsTableComponent;
  let fixture: ComponentFixture<ProblemsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProblemsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
