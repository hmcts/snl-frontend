import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { APP_ID, Inject, Injectable, NgModule, PLATFORM_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { EffectsModule } from '@ngrx/effects';
import {
    HTTP_INTERCEPTORS,
    HttpClientModule,
    HttpClientXsrfModule,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { SessionsService } from './sessions/services/sessions-service';
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppConfig } from './app.config';
import { AppConfigGuard } from './app-config.guard';
import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { isPlatformBrowser } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FullCalendarModule } from 'ng-fullcalendar';
import { CallendarComponent } from './core/callendar/callendar.component';
import { SessionModule } from './sessions/session.module';
import { SecurityModule } from './security/security.module';
import { HomeComponent } from './core/home/home.component';
import { SecurityService } from './security/services/security.service';
import { JudgesModule } from './judges/judges.module';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { Observable } from 'rxjs/Observable';
import { HearingPartModule } from './hearing-part/hearing-part.module';
import { MAT_DATE_LOCALE } from '@angular/material';
import { PocComponent } from './admin/components/poc/poc.component';
import { reducer } from './core/notification/reducers/notification.reducer';
import { NotificationEffects } from './core/notification/effects/notification.effects';
import { AdminModule } from './admin/admin.module';

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const xhr = req.clone({
            headers: req.headers.set('X-Requested-With', 'XMLHttpRequest'),
            withCredentials: true
        });
        return next.handle(xhr);
    }
}

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
  declarations: [
    AppComponent,
    CallendarComponent,
    HomeComponent,
        PocComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'snl-frontend' }),
    BrowserAnimationsModule,
    StoreModule.forRoot({core: reducer}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([NotificationEffects]),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    AngularMaterialModule,
    FullCalendarModule,
    FlexLayoutModule,
    SessionModule,
    SecurityModule,
    AdminModule,
      HttpClientXsrfModule.withOptions({
          cookieName: 'XSRF-TOKEN', // this is optional
          headerName: 'X-XSRF-TOKEN' // this is optional
      }),
    SecurityModule,
    JudgesModule,
    HearingPartModule
  ],
  providers: [SessionsService, AppConfig, AppConfigGuard, SecurityService,
      {provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true},
      {provide: HTTP_INTERCEPTORS, useClass: HttpXsrfInterceptor, multi: true},
      {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(APP_ID) private appId: string) {
        const platform = isPlatformBrowser(platformId) ?
            'in the browser' : 'on the server';
        console.log(`Running ${platform} with appId=${appId}`);
    }
}
