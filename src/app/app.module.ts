import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { APP_ID, Inject, Injectable, Injector, LOCALE_ID, NgModule, PLATFORM_ID } from '@angular/core';

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
import { SessionModule } from './sessions/session.module';
import { SecurityModule } from './security/security.module';
import { HomeComponent } from './core/home/home.component';
import { SecurityService } from './security/services/security.service';
import { JudgesModule } from './judges/judges.module';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { Observable } from 'rxjs/Observable';
import { HearingPartModule } from './hearing-part/hearing-part.module';
import { PocComponent } from './admin/components/poc/poc.component';
import { AdminModule } from './admin/admin.module';
import * as moment from 'moment';
import { ProblemsModule } from './problems/problems.module';
import { CoreModule } from './core/core.module';
import { PlannerModule } from './planner/planner.module';
import { FullCalendarModule } from './common/ng-fullcalendar/module';
import { NotificationModule } from './features/notification/notification.module';
import { NotificationEffects } from './features/notification/effects/notification.effects';

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

    constructor(private tokenExtractor: HttpXsrfTokenExtractor, private injector: Injector) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const headerName = 'X-XSRF-TOKEN';
        let token = null;
        let securityService = this.injector.get<SecurityService>(SecurityService);
        if (securityService && securityService.currentUser && securityService.currentUser.xsrftoken) {
            token = securityService.currentUser.xsrftoken as string;
            console.log('Token: ' + token);
        }

        if (token !== null && !req.headers.has(headerName)) {
            req = req.clone({headers: req.headers.set(headerName, token)});
        }
        return next.handle(req);
    }
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        PocComponent
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'snl-frontend'}),
        BrowserAnimationsModule,
        StoreModule.forRoot({}),
        StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production, // Restrict extension to log-only mode
        }),
        EffectsModule.forRoot([]),
        HttpClientModule,
        FormsModule,
        CoreModule,
        AppRoutingModule,
        AngularMaterialModule,
        FullCalendarModule,
        FlexLayoutModule,
        SessionModule,
        SecurityModule,
        AdminModule,
        NotificationModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'XSRF-TOKEN', // this is optional
            headerName: 'X-XSRF-TOKEN' // this is optional
        }),
        SecurityModule,
        JudgesModule,
        HearingPartModule,
        ProblemsModule,
        PlannerModule
    ],
    providers: [SessionsService, AppConfig, AppConfigGuard, SecurityService,
        {provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: HttpXsrfInterceptor, multi: true},
        {provide: LOCALE_ID, useValue: 'en-GB'},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(LOCALE_ID) private localeId: string,
        @Inject(APP_ID) private appId: string) {
        const platform = isPlatformBrowser(platformId) ?
            'in the browser' : 'on the server';
        console.log(`Running ${platform} with appId=${appId}`);

        moment.locale(localeId);
    }
}
