import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityModule } from '../security/security.module';
import { PocService } from './services/poc-service';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import {
    HTTP_INTERCEPTORS,
    HttpClientXsrfModule,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpXsrfTokenExtractor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpXsrfInterceptor implements HttpInterceptor {

    constructor(private tokenExtractor: HttpXsrfTokenExtractor) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const headerName = 'X-XSRF-TOKEN';
        let token = this.tokenExtractor.getToken() as string;
        if (token !== null && !req.headers.has(headerName)) {
            req = req.clone({headers: req.headers.set(headerName, token)});
        }
        return next.handle(req);
    }
}

@NgModule({
    imports: [
        CommonModule,
        SecurityModule,
        AngularMaterialModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'XSRF-TOKEN', // this is optional
            headerName: 'X-XSRF-TOKEN' // this is optional
        }),
    ],
  providers: [
    PocService,
      {provide: HTTP_INTERCEPTORS, useClass: HttpXsrfInterceptor, multi: true},
  ]
})
export class AdminModule {
}
