import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsSearchComponent } from './sessions-search.component';

describe('SessionsSearchComponent', () => {
  let component: SessionsSearchComponent;
  let fixture: ComponentFixture<SessionsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
