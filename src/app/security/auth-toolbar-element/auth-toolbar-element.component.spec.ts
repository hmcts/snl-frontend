import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthToolbarElementComponent } from './auth-toolbar-element.component';

describe('AuthToolbarElementComponent', () => {
  let component: AuthToolbarElementComponent;
  let fixture: ComponentFixture<AuthToolbarElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthToolbarElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthToolbarElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
