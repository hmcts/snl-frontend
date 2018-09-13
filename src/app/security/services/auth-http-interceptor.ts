import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { AuthorizationHeaderName } from '../models/access-token';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { SecurityContext } from './security-context.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

    constructor(readonly router: Router,
                private security: SecurityContext) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = this.addAuthenticationHeader(req);
        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    const newToken = req.headers.get('TokenRefresh');
                    console.log('oldToken ', this.security.getToken());
                    if (newToken) {
                        this.security.setToken(newToken);
                        console.log('newToken ', newToken);
                    }
                }
            }),
            catchError((errorResponse, c2) => {
                if (errorResponse && errorResponse.status === 401) {
                    this.security.logout(() => {
                        this.router.navigate(['/login']);
                    });
                }
                return Observable.throw(errorResponse);
            })
        ).catch(() => {
            // to leave the console clean (No ERROR console log entry)
            return Observable.of('');
        });
    }

    private addAuthenticationHeader(req: HttpRequest<any>) {
        const authToken = this.security.getToken();
        const headerName = AuthorizationHeaderName;
        if (authToken && !req.headers.has(headerName)) {
            req = req.clone({headers: req.headers.set(headerName, authToken)});
        }
        return req;
    }
}