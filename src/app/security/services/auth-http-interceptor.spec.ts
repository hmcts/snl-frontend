import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfig } from '../../app.config';
import { SecurityContext } from './security-context.service';
import { inject, TestBed } from '@angular/core/testing';
import { AuthHttpInterceptor } from './auth-http-interceptor';
import { Router } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';

let storageSpy, httpMock, securityContext, router: Router;

const fakeUrl = 'https://doesnot.matter.com';
const mockedAppConfig = {
    getApiUrl: () => fakeUrl,
    createApiUrl: (suffix) => {
        return fakeUrl + suffix;
    }
} as AppConfig;

class MockRouter {
    navigate(url: string[]) {
        return url;
    }
}

describe('AuthHttpInterceptor', () => {
    beforeEach(() => {

        storageSpy = jasmine.createSpyObj('storage', ['removeItem', 'setItem', 'getItem']);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthHttpInterceptor, SecurityContext,
                {provide: AppConfig, useValue: mockedAppConfig},
                {provide: Router, useClass: MockRouter},
                {provide: 'STORAGE', useValue: storageSpy},
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthHttpInterceptor,
                    multi: true,
                },
            ]
        });
    });

    beforeEach(() => {
        httpMock = TestBed.get(HttpTestingController);
        securityContext = TestBed.get(SecurityContext);
        router = TestBed.get(Router);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('intercept ', () => {

        it('Should check for new token in the response', inject([HttpClient, HttpTestingController],
            (http: HttpClient, mock: HttpTestingController) => {
            const spySetToken = spyOn(securityContext, 'setToken').and.callThrough();
            const spyGetToken = spyOn(securityContext, 'getToken').and.callThrough();
            const mockedHeaders = new HttpHeaders({'Refreshed-Token': 'test'});

            http.get('/api').subscribe(response => expect(response).toBeTruthy());
            const request1 = mock.expectOne('/api');
            request1.flush(null, {headers: mockedHeaders});

            mock.verify();
            expect(spySetToken).toHaveBeenCalled();
            expect(spyGetToken).toHaveBeenCalled();
        }));

        it('Should catch 401 status response and redirect user to login page', inject([HttpClient, HttpTestingController],
            (http: HttpClient, mock: HttpTestingController) => {
                const spyLogout = spyOn(securityContext, 'logout').and.callThrough();
                const spyNavigate = spyOn(router, 'navigate').and.callThrough();

                http.get('/api').subscribe(response => expect(response).toBeTruthy());
                const request1 = mock.expectOne('/api');
                request1.flush(null, {status: 401, statusText: 'unauthorized'});

                mock.verify();
                expect(spyLogout).toHaveBeenCalled();
                expect(spyNavigate).toHaveBeenCalledWith(['/login']);
            })
        );

        // HttpResponse
        it('Should pass through when status is 500', inject([HttpClient, HttpTestingController],
            (http: HttpClient, mock: HttpTestingController) => {
                const spySetToken = spyOn(securityContext, 'setToken').and.callThrough();
                const spyNavigate = spyOn(router, 'navigate').and.callThrough();

                http.get('/api').subscribe(response => expect(response).toBeTruthy());
                const request1 = mock.expectOne('/api');
                request1.flush(null, {status: 500, statusText: 'internalServerError'});

                mock.verify();
                expect(spySetToken).not.toHaveBeenCalled();
                expect(spyNavigate).not.toHaveBeenCalled();
            })
        );

    });
});
