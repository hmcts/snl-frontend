import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfig } from '../../app.config';
import { SecurityContext } from './security-context.service';
import { inject, TestBed } from '@angular/core/testing';
import { AuthHttpInterceptor } from './auth-http-interceptor';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

let storageSpy, httpMock, securityContext;
const fakeUrl = 'https://doesnot.matter.com';
const mockedAppConfig = {
    getApiUrl: () => fakeUrl,
    createApiUrl: (suffix) => {
        return fakeUrl + suffix;
    }
} as AppConfig;

describe('AuthHttpInterceptor', () => {
    beforeEach(() => {

        storageSpy = jasmine.createSpyObj('storage', ['removeItem', 'setItem', 'getItem']);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthHttpInterceptor, SecurityContext,
                {provide: AppConfig, useValue: mockedAppConfig},
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

        it('Should pass through error when status is 401', inject([HttpClient, HttpTestingController],
            (http: HttpClient, mock: HttpTestingController) => {
                expect( function() {
                    http.get('/api').subscribe(response => expect(response).toBeTruthy());
                    const request1 = mock.expectOne('/api');
                    request1.flush(null, {status: 401, statusText: 'unauthorized'});

                    mock.verify();
                }).toThrow(new HttpErrorResponse({
                        status: 401,
                        statusText: 'unauthorized',
                        url: '/api',
                        error: 'null'
                    } ));
            }
        ));

        it('Should pass through error when status is 500', inject([HttpClient, HttpTestingController],
            (http: HttpClient, mock: HttpTestingController) => {
                expect( function() {
                    http.get('/api').subscribe(response => expect(response).toBeTruthy());
                    const request1 = mock.expectOne('/api');
                    request1.flush(null, {status: 500, statusText: 'internalServerError'});

                    mock.verify();
                } ).toThrow(new HttpErrorResponse({
                    status: 500,
                    statusText: 'internalServerError',
                    url: '/api',
                    error: 'null'
                } ));
            })
        );
    });
});
