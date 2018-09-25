import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { AuthorizationHeaderName } from '../models/access-token';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { SecurityContext } from './security-context.service';
import { Router } from '@angular/router';

export const new_token_header_name = 'Refreshed-Token';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

    constructor(readonly router: Router,
                private security: SecurityContext) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = this.addAuthenticationHeader(req);
        return next.handle(req).pipe(
            tap(this.handleNewAuthToken),
            catchError(this.handle401Error)
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

    private handleNewAuthToken = (event) => {
        if (event instanceof HttpResponse) {
            const newToken = event.headers.get(new_token_header_name);
            if (newToken) {
                this.security.setToken(newToken);
            }
        }
    };

    private handle401Error = (errorResponse) => {
        if (errorResponse && errorResponse.status === 401) {
            this.security.logout(() => {
                this.router.navigate(['/login']);
            });
        }
        return Observable.throw(errorResponse);
    };
}
