import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import { SecurityService } from '../../../security/services/security.service';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  const mockUser = jasmine.createSpyObj('currentUser', [ 'username' ]);
  mockUser.username.and.returnValue('JohnSmith');
  const mockSecurityService = jasmine.createSpyObj('securityService', [ 'currentUser' ]);
  mockSecurityService.currentUser.and.returnValue(mockUser);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations : [ MainComponent ],
      providers : [ MainComponent,
        {
          provide : SecurityService,
          useValue : mockSecurityService
        }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
