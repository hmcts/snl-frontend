import { TestBed } from '@angular/core/testing';
import { SecurityService } from '../services/security.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfig } from '../../app.config';

let loginComponent: LoginComponent;
let httpMock: HttpTestingController;
let storageSpy: jasmine.Spy;
let navigateSpy: jasmine.Spy;
let navigateByUrlSpy: jasmine.Spy;

const mockedAppConfig = { getApiUrl() {'https://google.co.uk'},
    createApiUrl(suffix) { return this.getApiUrl() + suffix}
};

const expectedUrlSignIn = `${mockedAppConfig.getApiUrl()}/security/signin`;
const expectedUrlSecurity = `${mockedAppConfig.getApiUrl()}/security/user`;

const successfulLoginResponse = {
    accessToken: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJvZmZpY2VyMSIsImlhdCI6MTUzMTQwMjI1NiwiZXhwIjoxNTMxNDA0MDU2fQ' +
    '.LMPw_wMySaTgM3WgNcpI0pnvohiePTj0UMujKtZ5IPNUYtSCO5_Z7Gq7cowANfKRZw2AIiB5nPfuo8y23IirSw',
    tokenType: 'Bearer'
};

const judgeUserResponse = {
    'authorities': [
        {'authority': 'ROLE_USER'},
        {'authority': 'ROLE_JUDGE'}],
    'username': 'judge1',
    'accountNonExpired': true,
    'accountNonLocked': true,
    'credentialsNonExpired': true,
    'enabled': true
};

describe('LoginComponent', () => {
    beforeEach(() => {
        storageSpy = jasmine.createSpyObj('storage', ['removeItem', 'setItem']);

        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([]),
                AngularMaterialModule,
                FormsModule,
                HttpClientTestingModule
            ],
            providers: [LoginComponent, SecurityService, AppConfig,
                { provide: AppConfig, useValue: mockedAppConfig },
                { provide: 'STORAGE', useValue: storageSpy}
            ]
        });

        httpMock = TestBed.get(HttpTestingController);
        loginComponent = TestBed.get(LoginComponent);
        navigateSpy = spyOn(loginComponent.router, 'navigate');
        navigateByUrlSpy = spyOn(loginComponent.router, 'navigateByUrl');
    });

    afterEach(() => {
        httpMock.verify()
    });

    it('should create component', () => {
        expect(loginComponent).toBeDefined();
    });

    describe('login', () => {
        it('should call proper urls while logging in',  () => {
            loginComponent.login();

            httpMock.expectOne(expectedUrlSignIn).flush(successfulLoginResponse);
            httpMock.expectOne(expectedUrlSecurity).flush([]);

            expect(navigateSpy).toHaveBeenCalledWith(['/home']);
        });

        it('should redirect judge user to proper url', () => {
            loginComponent.login()

            httpMock.expectOne(expectedUrlSignIn).flush(successfulLoginResponse);
            httpMock.expectOne(expectedUrlSecurity).flush(judgeUserResponse);

            expect(navigateSpy).toHaveBeenCalledWith(['/home/judge/main'])
        });

        it('should return to url after login', () => {
            loginComponent.returnUrl = 'niceUrl';
            loginComponent.login();

            httpMock.expectOne(expectedUrlSignIn).flush(successfulLoginResponse);
            httpMock.expectOne(expectedUrlSecurity).flush([]);

            expect(navigateByUrlSpy).toHaveBeenCalledWith('niceUrl');
        });
    });

    describe('ngOnInit', () => {
        it('should not redirect if not logged in', () => {
            loginComponent.returnUrl = 'niceUrl';

            loginComponent.ngOnInit();

            httpMock.expectOne(expectedUrlSecurity).flush([]);

            expect(navigateByUrlSpy).not.toHaveBeenCalled();
        });

        it('should redirect if logged in', () => {
            loginComponent.returnUrl = 'niceUrl';

            loginComponent.ngOnInit();

            httpMock.expectOne(expectedUrlSecurity).flush(judgeUserResponse);

            expect(navigateByUrlSpy).toHaveBeenCalledWith('niceUrl');
        });

    });

});
