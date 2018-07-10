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
        it('Logging out should remove authorization data from storage and set user to empty', () => {
            securityService.currentUser = exampleUserData;

            securityService.logout(callbackSpy);

            expect(securityService.currentUser).toEqual(User.emptyUser());
            expect(storageSpy.removeItem).toHaveBeenCalledWith(AuthorizationHeaderName);
            expect(callbackSpy).toHaveBeenCalled();
        });
    });

    describe('Authentication verification', () => {
        let userAuthProperties = ['accountNonExpired', 'accountNonLocked', 'credentialsNonExpired', 'enabled'];

        userAuthProperties.forEach((propertyName) => {
            let currentUser = {...exampleUserData,
                accountNonExpired: true,
                accountNonLocked: true,
                credentialsNonExpired: true,
                enabled: true
            } as User;

            it(`should return false if at least '${propertyName}' is false`, () => {
                currentUser[propertyName] = false;
                securityService.currentUser = currentUser;

                expect(securityService.isAuthenticated()).toBeFalsy();
            })
        })

        it(`should return true if all of the properties: ( ${userAuthProperties.join(', ')} ) are true`, () => {
            let currentUser = {...exampleUserData,
                accountNonExpired: true,
                accountNonLocked: true,
                credentialsNonExpired: true,
                enabled: true
            } as User;
            securityService.currentUser = currentUser;

            expect(securityService.isAuthenticated()).toBeTruthy();
        })
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
            expect(securityService.currentUser).toEqual(User.emptyUser());

            securityService.refreshAuthenticatedUserData(callbackSpy);

            httpMock.expectOne(expectedUserURL).flush(userResponse);
            expect(securityService.currentUser).toEqual(exampleUserData);
        });

        it('Refreshing user data should with no username should set user to empty', () => {
            securityService.refreshAuthenticatedUserData(callbackSpy);

            httpMock.expectOne(expectedUserURL).flush({});
            expect(securityService.currentUser).toEqual(User.emptyUser());
        });

        afterEach(() => {
            expect(callbackSpy).toHaveBeenCalled();
        })
    });
});
