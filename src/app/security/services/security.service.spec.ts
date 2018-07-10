import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfig } from '../../app.config';
import { TestBed } from '@angular/core/testing';
import { SecurityService } from './security.service';
import { AuthorizationHeaderName } from '../models/access-token';
import { User } from '../models/user.model';

let storageSpy, httpMock, securityService: SecurityService;
const mockedAppConfig = {
    getApiUrl: () => 'https://google.co.uk',
    createApiUrl: (suffix) => {
        return 'https://google.co.uk' + suffix;
    }
};

const expectedSignInURL = `${mockedAppConfig.getApiUrl()}/security/signin`;
const expectedUserURL = `${mockedAppConfig.getApiUrl()}/security/user`;
const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJvZmZpY2VyMSIsImlhdCI6MTUzMTIxMTQzOSwiZXhwIjoxNTMxMjEzMjM5fQ.OC4j7jlIDetjMpvXAJvHLD' +
    'JokjxgW517Rb4UgKj8Vh2j1cLPx4nARZaKNG-g-LrxAelGAvTWUjbrAlDJtbWnrQ';
const signinResponse = {
    'accessToken': token,
    'tokenType': 'Bearer'
};
const userResponse = {
    'authorities': [
        {'authority': 'ROLE_USER'},
        {'authority': 'ROLE_OFFICER'}],
    'username': 'officer1',
    'accountNonExpired': true,
    'accountNonLocked': true,
    'credentialsNonExpired': true,
    'enabled': true
};
const creds = {'username': 'officer1', 'password': 'password'};

const expectedUserData = Object.assign(new User(), userResponse);

describe('Security Service', () => {
    beforeEach(() => {

        storageSpy = jasmine.createSpyObj('storage', ['removeItem', 'setItem']);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                SecurityService,
                { provide: AppConfig, useValue: mockedAppConfig },
                { provide: 'STORAGE', useValue: storageSpy}

            ]
        });
        securityService = TestBed.get(SecurityService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('Logout', () => {
        fit('Logging out should remove authorization data from storage and set user to empty', () => {
            let callbackSpy = jasmine.createSpy();
            securityService.logout(callbackSpy);

            expect(securityService.currentUser).toEqual(User.emptyUser());
            expect(storageSpy.removeItem).toHaveBeenCalledWith(AuthorizationHeaderName);
            expect(callbackSpy).toHaveBeenCalled();
        });
    });

    describe('Login', () => {
        fit('Signing in should call backend, set storage data and refresh user data', () => {
            let callbackSpy = jasmine.createSpy();
            spyOn(securityService, 'refreshAuthenticatedUserData');

            securityService.authenticate(creds, callbackSpy);

            httpMock.expectOne(expectedSignInURL).flush(signinResponse);
            expect(storageSpy.setItem).toHaveBeenCalledWith(AuthorizationHeaderName, `Bearer ${token}`);
            expect(securityService.refreshAuthenticatedUserData).toHaveBeenCalledWith(callbackSpy);
        });

        fit('Refreshing user data should update current username', () => {
            let callbackSpy = jasmine.createSpy();

            securityService.refreshAuthenticatedUserData(callbackSpy);

            httpMock.expectOne(expectedUserURL).flush(userResponse);
            expect(securityService.currentUser).toEqual(expectedUserData);
            expect(callbackSpy).toHaveBeenCalled();
        });
    });
});
