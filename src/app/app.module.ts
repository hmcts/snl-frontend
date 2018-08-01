import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { APP_ID, Inject, Injectable, LOCALE_ID, NgModule, PLATFORM_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
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
import { AuthorizationHeaderName } from './security/models/access-token';
import { getLocalStorage } from './utils/storage';
import { ReportModule } from './features/reports/report.module';

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
export class AuthHttpInterceptor implements HttpInterceptor {

    constructor(@Inject('STORAGE') private storage: Storage) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = this.addAuthenticationHeader(req);
        return next.handle(req);
    }

    private addAuthenticationHeader(req: HttpRequest<any>) {
        let headerToken = this.storage.getItem(AuthorizationHeaderName);
        let headerName = AuthorizationHeaderName;
        if (headerToken !== null && !req.headers.has(headerName)) {
            req = req.clone({headers: req.headers.set(headerName, headerToken)});
        }
        return req;
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
        SecurityModule,
        JudgesModule,
        HearingPartModule,
        ProblemsModule,
        PlannerModule,
        ReportModule
    ],
    providers: [SessionsService, AppConfig, AppConfigGuard, SecurityService,
        {provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true},
        {provide: LOCALE_ID, useValue: AppConfig.locale},
        {provide: 'STORAGE', useFactory: getLocalStorage},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        @Inject(LOCALE_ID) localeId: string,
        @Inject(APP_ID) appId: string) {
        const platform = isPlatformBrowser(platformId) ?
            'in the browser' : 'on the server';
        console.log(`Running ${platform} with appId=${appId}`);

        moment.locale(localeId);
    }
}
