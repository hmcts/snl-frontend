import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { SecurityContext } from '../../../security/services/security-context.service';

describe('MainComponent', () => {
    let component: MainComponent;
    let fixture: ComponentFixture<MainComponent>;

    const mockUser = jasmine.createSpyObj('currentUser', ['username']);
    mockUser.username.and.returnValue('JohnSmith');
    const mockSecurity = jasmine.createSpyObj('securityContext', ['currentUser']);
    mockSecurity.currentUser.and.returnValue(mockUser);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MainComponent],
            providers: [MainComponent,
                {
                    provide: SecurityContext,
                    useValue: mockSecurity
                }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainComponent);
        component = fixture.componentInstance;
        // fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
