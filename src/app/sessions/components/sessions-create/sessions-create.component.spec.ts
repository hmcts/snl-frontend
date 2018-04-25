import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsCreateComponent } from './sessions-create.component';

describe('SessionsCreateComponent', () => {
  let component: SessionsCreateComponent;
  let fixture: ComponentFixture<SessionsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
