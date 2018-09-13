import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfig } from '../../app.config';
import { SecurityService } from './security.service';
import { User } from '../models/user.model';
import { SecurityContext } from './security-context.service';
import { TestBed } from '@angular/core/testing';
import { AuthorizationHeaderName } from '../models/access-token';

let storageSpy, httpMock, securityService: SecurityService, securityContext: SecurityContext;
const fakeUrl = 'https://doesnot.matter.com';
const mockedAppConfig = {
    getApiUrl: () => fakeUrl,
    createApiUrl: (suffix) => {
        return fakeUrl + suffix;
    }
} as AppConfig;
let callbackSpy = jasmine.createSpy();

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

const exampleUserData = Object.assign(new User(), userResponse);

describe('Security Service', () => {
    beforeEach(() => {

        storageSpy = jasmine.createSpyObj('storage', ['removeItem', 'setItem', 'getItem']);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                SecurityService, SecurityContext,
                { provide: AppConfig, useValue: mockedAppConfig },
                { provide: 'STORAGE', useValue: storageSpy}
            ]
        });
    });

    beforeEach(() => {
        httpMock = TestBed.get(HttpTestingController);
        // const httpClient = TestBed.get(HttpClient);
        securityContext = TestBed.get(SecurityContext);
        securityService = TestBed.get(SecurityService); // new SecurityService(securityContext, httpClient, mockedAppConfig);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('Logout', () => {
        it('Logging out should remove authorization data from storage and set user to empty', () => {
            securityContext.userSubject$.next(exampleUserData);

            securityService.logout(callbackSpy);

            expect(securityService.getCurrentUser()).toEqual(User.emptyUser());
            expect(securityContext.getToken()).toEqual(undefined);
            expect(callbackSpy).toHaveBeenCalled();
        });
    });

    describe('Authentication verification', () => {
        let userAuthProperties = ['accountNonExpired', 'accountNonLocked', 'credentialsNonExpired', 'enabled'];

        userAuthProperties.forEach((propertyName) => {
            let currentUser = {
                ...exampleUserData,
                accountNonExpired: true,
                accountNonLocked: true,
                credentialsNonExpired: true,
                enabled: true
            } as User;

            it(`should return false if at least '${propertyName}' is false`, () => {
                currentUser[propertyName] = false;
                securityContext.userSubject$.next(currentUser);

                expect(securityService.isAuthenticated()).toBeFalsy();
            });
        });

        it(`should return true if all of the properties: ( ${userAuthProperties.join(', ')} ) are true`, () => {
            let currentUser = {
                ...exampleUserData,
                accountNonExpired: true,
                accountNonLocked: true,
                credentialsNonExpired: true,
                enabled: true
            } as User;
            securityContext.userSubject$.next(currentUser);

            expect(securityService.isAuthenticated()).toBeTruthy();
        });
    });

    describe('Login', () => {
        it('Signing in should call backend, set storage data and refresh user data', () => {
            spyOn(securityService, 'refreshAuthenticatedUserData');

            securityService.authenticate(creds, callbackSpy);
            httpMock.expectOne(expectedSignInURL).flush(signinResponse);

            expect(storageSpy.setItem).toHaveBeenCalledWith(AuthorizationHeaderName, `Bearer ${token}`);
            expect(securityService.refreshAuthenticatedUserData).toHaveBeenCalledWith(callbackSpy);
        });

        it('Refreshing user data should update current user data', () => {
            securityService.refreshAuthenticatedUserData(callbackSpy);

            httpMock.expectOne(expectedUserURL).flush(userResponse);
            expect(securityService.getCurrentUser()).toEqual(exampleUserData);
        });

        it('Refreshing user data should with no username should set user to empty', () => {
            securityService.refreshAuthenticatedUserData(callbackSpy);

            httpMock.expectOne(expectedUserURL).flush({});
            expect(securityService.getCurrentUser()).toEqual(User.emptyUser());
        });

        afterEach(() => {
            expect(callbackSpy).toHaveBeenCalled();
        });
    });
});
