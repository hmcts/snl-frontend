import {
    HttpHandler, HttpHeaderResponse,
    HttpInterceptor, HttpProgressEvent,
    HttpRequest,
    HttpResponse, HttpSentEvent,
    HttpUserEvent
} from '@angular/common/http';
import { AuthorizationHeaderName } from '../models/access-token';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { SecurityContext } from './security-context.service';

export const new_token_header_name = 'Refreshed-Token';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

    constructor(private readonly security: SecurityContext) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>>  {
        req = this.addAuthenticationHeader(req);
        return next.handle(req).pipe(
            tap(this.handleNewAuthToken),
        );
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
        if (event instanceof HttpResponse && event.headers) {
            const newToken = event.headers.get(new_token_header_name);
            if (newToken) {
                this.security.setToken(newToken);
            }
        }
    };
}
